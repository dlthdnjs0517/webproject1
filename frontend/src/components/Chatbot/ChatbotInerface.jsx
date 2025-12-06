// components/Chatbot/ChatbotInterface.jsx
import axios from "../../lib/axios";
import { useState, useRef, useEffect } from "react";

export default function ChatbotInterface({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "안녕하세여! AI 도우미입니다. 무엇을 도와드릴까여?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleWheel = (e) => {
      e.stopPropagation(); //이벤트 버블링 차단 코드
    };

    chatContainer.addEventListener("wheel", handleWheel);
    chatContainer.addEventListener("touchmove", handleWheel);

    return () => {
      chatContainer.removeEventListener("wheel", handleWheel);
      chatContainer.removeEventListener("touchmove", handleWheel);
    };
  }, []);
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setLoading(true);

    try {
      const response = await axios.post("/api/geminichat/chat", {
        message: userMessage,
        sessionId: sessionId,
      });

      const data = await response.data; //axios 는 .json 이 아니라 .data 사용

      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
        console.log("sessionId 저장:", sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col rounded-3xl overflow-hidden h-full bg-white"
    >
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">AI CHATBOT</h3>
          <p className="text-xs opacity-90">
            이 사이트에 대해 궁금한게 있나여?
          </p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-lg transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow-sm rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="메시지를 입력하세요..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
