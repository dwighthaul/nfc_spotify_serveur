

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

app.use(cors());
app.options('*', cors());
 app.use((req, res, next) => {
	console.log("add allow origine");
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
  });

// Module installé recemment cors, memorystore


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
		resave: false,
		saveUninitialized: false,
		cookie: { 
			secure: true,            //setting this false for http connections
			maxAge: 3600000,
			expires: new Date(Date.now() + 3600000) 
		}
	})
);


app.use('/api/v1/login_spotify', login_spotify.router);
app.use('/api/v1/launch_song', launch_song);
app.use('/api/v1/playlists', playlists);


// Je pourrais modifier le dashboard spotify pour qu'il redirige directement vers api/v1/login_spotify mais pour l'instant
// pour pas trop perturber j'encapsule ça dans une fonction
app.get('/authCredential', (req, res) => {
	login_spotify.get_credential_spotify(req,res);
})


app.get('/', (req, res) => {
	console.log("hello world");
	res.sendStatus(200);
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
