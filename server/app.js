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
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.static("public"));

// /api/auth라는 경로로 들어오는 모든 요청을 authRouter에게 위임
const authRouter = require("./routes/authRoute.js");
app.use("/api/auth", authRouter);

const orgChartRouter = require("./routes/orgRoute.js");
app.use("/orgChart", orgChartRouter);

const menuRouter = require("./routes/menuRoute.js");
app.use("/api/menu", menuRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(port, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});
