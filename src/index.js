const express = require('express')
const https = require('https');
const Auth = require('./authService');
const querystring = require('node:querystring');

const app = express()
const port = 3000

var auth = new Auth();
auth.auth(() => {
	console.log(auth.getBearer())
})

app.get('/auth', (req, res) => {
	res.send({ status: auth.getBearer() })
})




app.get('/spotify', (req, res) => {

	console.log("spotify")

	https.get("https://api.spotify.com/v1/playlists/1neO2bS5TBpEWPMerNhl5d", {
		headers: {
			"Authorization": 'Bearer ' + auth.getBearer()
		}

	}, (resSpotify) => {
		console.log(resSpotify.statusCode)
		console.log(resSpotify.statusMessage)
		let chunks = '';

		resSpotify.on('data', function (data) {
			console.log("DATA")
			chunks += data;
		}).on('end', function () {
			const dataConcat = JSON.parse(chunks);
			//let schema = JSON.parse(data);
			res.send(dataConcat)
		});

	});
})
app.get('/ids', (req, res) => {

	console.log("spotify#ids")

	https.get("https://api.spotify.com/v1/me/player/devices", {
		headers: {
			"Authorization": 'Bearer ' + auth.getBearer()
		}

	}, (resSpotify) => {
		console.log(resSpotify.statusCode)
		console.log(resSpotify.statusMessage)
		let chunks = '';

		resSpotify.on('data', function (data) {
			console.log("DATA")
			console.log(data)
			chunks += data;
		}).on('end', function () {
			const dataConcat = JSON.parse(chunks);
			res.send(dataConcat)
		});

	});

})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})