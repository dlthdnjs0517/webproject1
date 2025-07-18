const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User"); //users 컬렉션 모델

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "아이디는 잘못 되었습니다" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role || "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("로그인 처리 중 해당 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
