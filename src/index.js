const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

// Trust the first proxy (needed for secure cookies behind a reverse proxy)
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
	origin: 'https://dwighthaul.com',
	credentials: true,
	methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
	allowedHeaders: 'X-Requested-With,content-type'
};

app.use(cors(corsOptions));

// Session configuration
app.use(session({
	secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true, // Helps mitigate XSS attacks by restricting access to the cookie
		secure: true,  // Ensures the cookie is only sent over HTTPS
		sameSite: 'none', // Required for cross-site cookies
		maxAge: 86400000 // 1 day
	}
}));

app.get('/', (req, res) => {
	res.send('Home Page');
});

app.get('/set-session', (req, res) => {
	req.session.user = 'someUser';
	res.send('Session is set');
});



app.get('/get-cookie', (req, res) => {
	console.log('=============');
	console.log(req.session);
	console.log('=============');

	const user = req.session;

	res.json(user);
});

app.get('/set-cookie', (req, res) => {
	req.session.test = "IIIII"
	console.log('=============');
	console.log();
	console.log('=============');

	const user = req.session;

	res.json(user);
});

app.get('/get-all-sessions', (req, res) => {
	req.sessionStore.all((err, sessions) => {
		res.json(sessions);

	})
});


app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});