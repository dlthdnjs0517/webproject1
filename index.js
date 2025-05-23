const express = require('express');
const app = express();
const path = require('path');
const { title } = require('process');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
	res.render('index');
});


app.get('/orgChart', (req, res) => {
	res.render('orgChart', { title: '(주)백일몽-조직도' });
});



app.use(express.static('public'));

app.listen(port, () => {
	console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});