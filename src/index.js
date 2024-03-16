const express = require('express')
const https = require('node:https');
const Auth = require('./authService');


const app = express()
const port = 3000

var auth = new Auth();

app.get('/auth', (req, res) => {
	auth.auth(() => {

		res.send({ status: auth.getBearer() })
	})

})



app.get('/spotify', (req, res) => {

	console.log("spotify")

	https.get("https://api.spotify.com/v1/playlists/1neO2bS5TBpEWPMerNhl5d", {
		auth: 'Bearer ' + auth.getBearer()
	}, (resSpotify) => {
		console.log(resSpotify)
		res.send(resSpotify)
	});
	res.send("Hello")
})
app.get('/', (req, res) => {
	console.log("HOME")

	res.send("Hello Home")
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})