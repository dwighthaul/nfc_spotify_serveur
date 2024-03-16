const express = require('express')
const https = require('https');

const app = express()
const port = 3000

var accessTokenBearer = ""


app.get('/auth', (req, res) => {
	var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';
	var client_secret = 'dea14dbcfe904185b99bee1d5d75ede5';

	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
		},
		form: {
			grant_type: 'client_credentials'
		},
		json: true
	};

	https.request(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			accessTokenBearer = body.access_token;
		}
	});

	console.log(accessTokenBearer)

})



app.get('/spotify', (req, res) => {

	console.log("spotify")




	https.get("https://api.spotify.com/v1/playlists/1neO2bS5TBpEWPMerNhl5d", {
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