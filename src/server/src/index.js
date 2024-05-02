

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var port = 3001;

const login_spotify = require('./routes/authentification_spotify');
const launch_song = require('./routes/launch_song');
const playlists = require('./routes/playlists');
const cors = require('cors');
//const MemoryStore = require('memorystore')(session); // Use a memory store for demo purposes


const app = express();

// Add headers before the routes are defined
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});


app.use(cors());
app.use((req, res, next) => {
	console.log('req.session');
	console.log(req.session);


	next();
});


// Module installé recemment cors, memorystore


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
		resave: false,
		saveUninitialized: false
	})
);

app.get('/setSession', (req, res) => {
	req.session.user = { id: 1, username: 'example' };
	res.send({ 'msg': 'Session set' });
});

app.get('/getSession', (req, res) => {
	const user = req.session;
	res.json(user);
});

app.use('/api/v1/login_spotify', login_spotify.router);
app.use('/api/v1/launch_song', launch_song);
app.use('/api/v1/playlists', playlists);


// Je pourrais modifier le dashboard spotify pour qu'il redirige directement vers api/v1/login_spotify mais pour l'instant
// pour pas trop perturber j'encapsule ça dans une fonction
app.get('/authCredential', (req, res) => {
	login_spotify.get_credential_spotify(req, res);
})


app.get('/', (req, res) => {
	console.log("hello world");
	res.sendStatus(200);
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
