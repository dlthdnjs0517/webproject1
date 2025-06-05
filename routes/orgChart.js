const express = require('express');
const router = express.Router();
const path = require('path');


const departments = require('../constants/departments');
// const addEmployee = require('./models/Employee');




router.get('/', (req, res) => {
	res.render('orgChart', { departments, title: '(주)백일몽-조직도' });
})



module.exports = router;