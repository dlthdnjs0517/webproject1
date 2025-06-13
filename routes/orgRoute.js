const express = require('express');
const app = express();
const router = express.Router();//라우터 객체를 생성(메인이 아닌 하위 요소)
const path = require('path');


const departments = require('../constants/departments');
const Employee = require('../models/Employee');
const { title } = require('process');


app.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
	res.render('orgChart', { departments, title: '(주)백일몽-조직도' });
})

router.post('/addEmployee', async (req, res) => {
	try {
		const { name, department, position, email, assignedTask } = req.body;
		await new Employee({ name, department, position, email, assignedTask }).save();
		res.redirect('/orgChart');
	}
	catch (err) {
		console.error(err);
		res.status(500).send('직원 데이터 추가 중 오류가 발생했습니다!');
	}
})

router.get('/searchEmployee', async (req, res) => {
	try {
		const keyword = req.query.query;
		const search = await Employee.find({
			name: { $regex: keyword }
		});
		// console.log("✅ 검색 결과:", search);
		// res.json(search);
		const rawFields = Object.keys(Employee.schema.path);
		const fieldNames = rawFields.filter(field => !['_id', '__v'].includes(field));
		res.render('orgChart', { employees: search, fieldNames, keyword, departments, title: '(주)백일몽-조직도' });
	}
	catch (err) {
		console.error(err);
	}
})

module.exports = router;
//작성된 라우터 객체를 저장해서 내보내는 역할을 한다. 바깥에서 사용할 수 있도록