require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override')
const { title } = require('process');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL)
	.then(() => {
		console.log('Mongo connection open!')
	})
	.catch(err => {
		console.log(err)
	})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index');
});

const orgChartRouter = require('./routes/orgRoute');
app.use('/orgChart', orgChartRouter);


app.listen(port, () => {
	console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});