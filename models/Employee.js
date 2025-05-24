const { name } = require('ejs');
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({

	department: {
		type: String,
		enum: ['임원부', '생산부', '개발부', '영업부', '마케팅부', '관리부'],
		required: true
	},
	position: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: Number,
		required: true
	}

})