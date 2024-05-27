const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', `https://dwighthaul.com`);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

app.use(cors({
	origin: 'https://dwighthaul.com', // replace with your frontend domain
	credentials: true,
}));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.send('Hello');
});


app.get('/set-cookie', (req, res) => {
	res.cookie('testCookie', 'testValue', {
		httpOnly: true,
		secure: true,
		sameSite: 'None',
		domain: 'serveur.dwighthaul.net', // replace with your backend domain
	});
	res.send('Cookie set');
});

app.get('/get-cookie', (req, res) => {
	const cookie = req.cookies.testCookie;
	res.json({ cookie });
});

app.listen(80, () => {
	console.log('Server running on port 80');
});