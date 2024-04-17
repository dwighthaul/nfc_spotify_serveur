

const express = require('express')
const https = require('https');
const Auth = require('./authService');
const querystring = require('node:querystring');
const request = require('request');
const session = require('express-session');
var port = 3000;



const app = express()
const groceriesRoute = require('./routes/groceries');
const bodyParser = require('body-parser');

//app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
		resave: false,
		saveUninitialized: false,
	})
  );

//   app.use((req, res, next) => {
// 	console.log(`${req.method}:${req.url}`);
// 	next();
//   });
 

app.use('/api/v1/groceries', groceriesRoute);





var auth = new Auth();

// ça c'est appelé directement lorsqu'on lance le serveur
// auth.auth(() => {
// 	console.log(auth.getBearer())
// })


app.get('/auth', (req, res) => {
	res.send({ bearer: auth.getBearer(), code: auth.getCode(), status: auth.getBearer() })
})

app.get('/authRefresh', (req, res) => {
	auth.auth(() => {
		console.log(auth.getBearer())
	})

	res.send({ status: auth.getBearer() })
})



app.get('/', (req, res) => {
	res.send({ "hello": "Salut Jorane Yo !" })
})
app.get('/test', (req, res) => {
	res.send({ "hello": "Salut Benoit - 2" })
})


app.get('/login', function (req, res) {
	console.log("login fct");
	auth.getLogin(res);
});

app.get('/authCredential', (req, res) => {
	console.log("authCredential")
	auth.dealLogin(req, () => {
		// auth.lancerPlaylist((code, body) => {
		// 	res.send({ "code": code, "body": body })
		// })
	})

})



app.get('/lancerPlaylist', function (req, res) {
	auth.getLogin(res);
});



// app.get('/start', (req, res) => {

// 	console.log("spotify")

// 	request.get("https://api.spotify.com/v1/me", {
// 		headers: {
// 			"Authorization": 'Bearer ' + auth.getBearer()
// 		}

// 	}, (resSpotify) => {
// 		console.log(resSpotify.statusCode)
// 		console.log(resSpotify.statusMessage)
// 		let chunks = '';

// 		resSpotify.on('data', function (data) {
// 			console.log("DATA")
// 			chunks += data;
// 		}).on('end', function () {
// 			const dataConcat = JSON.parse(chunks);
// 			//let schema = JSON.parse(data);
// 			res.send(dataConcat)
// 		});

// 	});
// })
// app.get('/spotify', (req, res) => {

// 	console.log("spotify")

// 	https.get("https://api.spotify.com/v1/playlists/1neO2bS5TBpEWPMerNhl5d", {
// 		headers: {
// 			"Authorization": 'Bearer ' + auth.getBearer()
// 		}

// 	}, (resSpotify) => {
// 		console.log(resSpotify.statusCode)
// 		console.log(resSpotify.statusMessage)
// 		let chunks = '';

// 		resSpotify.on('data', function (data) {
// 			console.log("DATA")
// 			chunks += data;
// 		}).on('end', function () {
// 			const dataConcat = JSON.parse(chunks);
// 			//let schema = JSON.parse(data);
// 			res.send(dataConcat)
// 		});

// 	});
// })
// app.get('/ids', (req, res) => {

// 	console.log("spotify#ids")

// 	https.get("https://api.spotify.com/v1/me/player/devices", {
// 		headers: {
// 			"Authorization": 'Bearer ' + auth.getBearer()
// 		}

// 	}, (resSpotify) => {
// 		console.log(resSpotify.statusCode)
// 		console.log(resSpotify.statusMessage)
// 		let chunks = '';

// 		resSpotify.on('data', function (data) {
// 			console.log("DATA")
// 			console.log(data)
// 			chunks += data;
// 		}).on('end', function () {
// 			const dataConcat = JSON.parse(chunks);
// 			res.send(dataConcat)
// 		});

// 	});

// })



app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
