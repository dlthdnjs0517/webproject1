const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "guest",
  },
});

// 비밀번호 저장 전 자동 해시화
userSchema.pre("save", async function (next) {
  // 비밀번호가 변경되지 않았으면 스킵(guard clause)
  if (!this.isModified("password")) return;

  try {
    // salt rounds: 10 (보안과 성능의 균형)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error("비번 해시화 중 오류 발생:", error);
    throw error;
  }
});

module.exports = mongoose.model("User", userSchema);
