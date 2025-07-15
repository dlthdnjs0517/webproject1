const mongoose = require('mongoose');
const departments = require('../constants/departments');

const employeeSchema = new mongoose.Schema({

	department: {
		type: String,
		enum: departments.map(d => d.value),
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
	email: {
		type: String,
		required: true,
		unique: true,
		set: function (value) {
			if (value.endsWith('@daydream.com')) return value;
			if (value.includes('@')) throw new Error('도메인을 직접 입력하지 마세요!');
			return `${value}@daydream.com`
		}
	},
	assignedTask: {
		type: String
	}

})

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;