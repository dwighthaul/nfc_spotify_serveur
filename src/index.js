const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const SQLConnection = require('./controller/SQLConnection');
const user = require('./routes/user');
const spotify = require('./routes/spotify');
const userRuntimeDataHandler = require("./userRuntimeDataHandler")


const config = require('./config.js');

const port = process.env.SERVEUR_PORT;
const app = express();
app.use(express.static('public'))

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_ENDPOINT}`);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.set('trust proxy', 1);

// Session configuration
app.use(session({
	secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: false, // Helps mitigate XSS attacks by restricting access to the cookie
		secure: (process.env.NODE_ENV === "production"),  // Ensures the cookie is only sent over HTTPS
		sameSite: (process.env.NODE_ENV === "production") ? 'None' : 'Strict', // Required for cross-site cookies
		maxAge: 86400000 // 1 day
	}
}));



const c = new SQLConnection();
c.connect().then(() => {
	c.syncDatabase()
})


app.use((req, res, next) => {
	if (req.session?.cookie && req.session.cookie.expires > Date.now()) {
		// TODO : ça me plait pas trop qu'on ai connaissance ici d'une route encapsulé dans user..
		//return res.redirect('/user/login');
		userRuntimeDataHandler.delUser();
	}
	next();
});


app.use('/spotify/', spotify);
app.use('/user/', user);

app.get('/', (req, res) => {
	res.send(req.session);
})


app.get('/test', (req, res) => {
	//console.log("TOTO") 
	res.send({ hello: "world" });
})


app.listen(port, '0.0.0.0', () => {
	console.log(`Example app listening on port ${port}`)
})