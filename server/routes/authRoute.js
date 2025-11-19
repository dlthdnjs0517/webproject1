const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router(); //새로운 라우터 객체 생성
const User = require("../models/User"); //users 컬렉션 모델

//이 라우터 안에서 정의하는 모든 경로는 app.use('/api/auth',authRouter)에 의해
// /api/auth가 앞에 붙음.
// 이게 서버의 로그인 API임.

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "아이디나 패스워드가 맞는지 확인하십시오." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role || "guest" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("로그인 처리 중 해당 오류:", error);
    res.status(500).json({
      message: error.message || "서버오류",
    });
  }
});

module.exports = router;
