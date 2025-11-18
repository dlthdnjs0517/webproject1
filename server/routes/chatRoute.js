const express = require("express");
// const { v4: uuidv4 } = require("uuid");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const fs = require("fs");
const path = require("path");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// 모든 클래스가 초기화됨 : new ApiClient, new Models,new Chats(models,apiClient)
//const sessionId = uuidv4();

//페르소나 로드
const personaPath = path.join(__dirname, "../config/persona.json");
const persona = JSON.parse(fs.readFileSync(personaPath, "utf8")); //json파일 읽기

//첫 세션 저장소
const chatSessions = new Map();

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const sid = sessionId || `session_${Date.now()}`;

    let chat = chatSessions.get(sid);

    if (!chat) {
      chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: persona.instructions.join("\n"),
          thinkingConfig: {
            thinkingBudget: 0, //Disable thinking
          },
        },
        history: [],
      });

      chatSessions.set(sid, chat);
      console.log(`새 세션: ${sid}`);
    }

    const response = await chat.sendMessage({
      message,
    });

    res.json({
      reply: response.text,
      sessionId: sid,
    });
  } catch (error) {
    console.error("error :", error);
    res.status(500).json({ error: "오류 발생함." });
  }
});
//post 요청을 "받는" 서버 쪽 엔드포인트

module.exports = router;
