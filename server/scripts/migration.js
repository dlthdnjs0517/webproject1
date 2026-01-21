const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function runMigration() {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("DB 연결 성공");

		const users = await User.find({});
		console.log(`조회된 사용자 수: ${users.length}`);

		for (let user of users) {
			if (user.password.startsWith("$2b$")) {
				console.log(`${user.username}의 비밀번호는 이미 해시화되어 있습니다.`);
				continue;
			}
			user.markModified("password");
			await user.save();
			console.log(`${user.username}의 비번 해시화 완료!.`);
		}
		console.log("모든 사용자의 비번 해시화 완료!");
	} catch (error) {
		console.error("비번 해시화 중 오류 발생:", error);
	} finally {
		//DB 연결 종료
		await mongoose.connection.close();
		console.log("DB 연결 종료!");
	}
}
runMigration();