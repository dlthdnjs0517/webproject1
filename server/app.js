require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");
const { title } = require("process");
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("❌ MongoDB 연결 실패:", err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", // 내 컴퓨터에서 개발할 때
  process.env.FRONTEND_URL, // Render 서버에 배포되었을 때
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. 요청의 출처(origin)가 allowedOrigins 배열에 포함되어 있는가?
      // 2. Postman 같은 도구에서 보내서 출처(origin)가 없는 요청인가?
      // -> 둘 중 하나라도 참이면 요청을 허용한다.
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("CORS에 의해 허용되지 않음"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static("public"));

// /api/auth라는 경로로 들어오는 모든 요청을 authRouter에게 위임
const authRouter = require("./routes/authRoute.js");
app.use("/api/auth", authRouter);

const orgChartRouter = require("./routes/orgRoute.js");
app.use("/api/org", orgChartRouter);

const menuRouter = require("./routes/menuRoute.js");
app.use("/api/menu", menuRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.listen(port, () => {
  console.log(`✅ 서버 실행 중: https://localhost:${port}`);
});
