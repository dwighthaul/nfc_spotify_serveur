const express = require('express')
const https = require('node:https');

const app = express()
const port = 3000

const accessToken = "b6df1ac233ea4d359790c9a95ccb1ebb"

app.get('/spotify', (req, res) => {
	console.log("spotify")

	https.get("https://api.spotify.com/v1/me", {
		auth: 'Bearer ' + accessToken
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