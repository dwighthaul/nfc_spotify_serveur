

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config.js');
const cors = require('cors');

const login_spotify = require('./routes/authentification_spotify');
const launch_song = require('./routes/launch_song');
const playlists = require('./routes/playlists');
const devices = require('./routes/devices');
const SQLConnection = require('./controller/SQLConnection');
const userController = require('./controller/UserController');
const authentication = require('./controller/Authentication');
const nfcTagsController = require('./controller/NFCTagsController');


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

app.use(cors({
	origin: `${process.env.CLIENT_ENDPOINT}`,
	credentials: true
}));

const c = new SQLConnection();
c.connect().then(() => {
	c.syncDatabase()
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60000
		}, // value of maxAge is defined in milliseconds. 

	})
);


app.get('/getUsers', (req, res) => {
	userController.getUsers().then((data) => {
		res.send(data);
	});
});


app.get('/getTags', (req, res) => {
	nfcTagsController.getTags().then((data) => {
		res.send(data);
	});
});


// TODO : voir ce qui est la best practice, le server gere la session ou le client (et il envoie le username en parametre)
// A priori les get ne prenent pas de body donc c'est plus simple si je laisse le serveur gérer
app.get('/getClientIdAndSecret', (req, res) => {
	const username = req.session?.user?.username ?? '';
	userController.getClientIdAndSecret(username).then((data) => {
		// Pour Paul : j'ai eu un gros soucis avec ça, si je stringify pas ton code du client ne l'accepte pas
		// Je savais pas si je dois adapter pour que le client fit le serveur ou inversement 
		// J'ai choisis le serveur vu qu'on utilisait deja ta fct un peu partout sur le côté client 
		if (data) {
			const response = {
				"clientId": data.clientId,
				"clientSecret": data.clientSecret
			};
			res.json(response);
		} else {
			res.json({});
		}

	});
});


app.post('/login', (req, res) => {

	authentication.verifyLogin(req.body.username, req.body.password, (result) => {
		if (result.status === "KO") {
			res.sendStatus(401).send(result.data)
			return
		}
		if (result.status === "OK") {
			req.session.user = result.data
			res.send(result.data)
		}
	});
});


app.post('/logout', (req, res) => {

	console.log('logout')

	delete req.session.user
	res.sendStatus(200)

});


app.use((req, res, next) => {
	console.log('=============');
	console.log(req.session);
	console.log('=============');

	next();
});



app.get('/getSession', (req, res) => {
	console.log('=============');
	console.log(req.session);
	console.log('=============');

	const user = req.session;

	res.json(user);
});



app.post('/updateSettings', (req, res) => {
	console.log('Update Settings')
	// TODO : voir ce qui est la best practice, le server gere la session ou le client (et il envoie le username en parametre)
	const username = req.session?.user?.username ?? '';
	userController.updateSettings(req.body.clientId, req.body.clientSecret, username, (result) => {
		res.sendStatus(200);
	});
});



app.use('/api/v1/login_spotify', login_spotify.router);
app.use('/api/v1/launch_song', launch_song);
app.use('/api/v1/playlists', playlists);
app.use('/api/v1/devices', devices);


// Je pourrais modifier le dashboard spotify pour qu'il redirige directement vers api/v1/login_spotify mais pour l'instant
// pour pas trop perturber j'encapsule ça dans une fonction
app.get('/authCredential', (req, res) => {
	login_spotify.get_credential_spotify(req, res);
})

app.get('/', (req, res) => {
	res.send(req.session);
})

app.get('/test', (req, res) => {
	console.log("TOTO")
	const hello = { hello: "jorane" }
	res.send(hello);
})


app.listen(port, '0.0.0.0', () => {
	console.log(`Example app listening on port ${port}`)
})
