const https = require('node:https');
const request = require('request');

var redirect_uri = 'http://localhost:3000/authCredential';
const querystring = require('node:querystring');
var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';

const id_device = `50c14080a6b470701bbf7baada526a6133acc4da`
const id_playlist = ``


module.exports = class Auth {

	accessTokenBearer;
	loginCode;
	loginStatus;

	constructor() {
	}

	auth(callback) {
		console.log(this.loginCode)
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: this.loginCode,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				"Authorization": "Basic YjZkZjFhYzIzM2VhNGQzNTk3OTBjOWE5NWNjYjFlYmI6ZGVhMTRkYmNmZTkwNDE4NWI5OWJlZTFkNWQ3NWVkZTU=",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			json: true
		};

		request.post(options, (error, reponse, body) => {
			console.log('body.access_token: ' + body.access_token);

			this.accessTokenBearer = body.access_token
			callback()
		});
	};

	getLogin(res) {

		var state = "OzeSpnW3t00EsMKw";
		var scope = 'user-read-private user-modify-playback-state user-read-playback-state';

		res.redirect('https://accounts.spotify.com/authorize?' +
			querystring.stringify({
				response_type: 'code',
				client_id: client_id,
				scope: scope,
				redirect_uri: redirect_uri,
				state: state
			}));
	}

	dealLogin(req, callback) {
		console.log(`Login succes : `)
		console.log(`Code : ` + req.query.code)
		console.log(`State : ` + req.query.state)
		this.loginCode = req.query.code
		this.loginStatus = req.query.state

		this.auth(() => {
			console.log("Auth OK")
			callback()
		})


	}

	lancerPlaylist() {

		console.log('lancerPlaylist')
		console.log('lancerPlaylist : id_device : ' + id_device)
		console.log('lancerPlaylist : this.accessTokenBearer : ' + this.accessTokenBearer)

		const options = {
			body: {
				"context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
				"offset": {
					"position": 0
				},
				"position_ms": 0
			},
			headers: {
				"Authorization": "Bearer " + this.accessTokenBearer,
			},
			json: true
		};

		var url = "https://accounts.spotify.com/v1/me/player/play?device_id=50c14080a6b470701bbf7baada526a6133acc4da"
		console.log(url)
		request.put("https://accounts.spotify.com/v1/me/player/play?device_id=50c14080a6b470701bbf7baada526a6133acc4da", options, (error, reponse, body) => {
			console.log("Lancé")
			console.log(reponse.statusCode)
			console.log(reponse.body)
		})
	}



	getBearer() {
		return this.accessTokenBearer;
	}
	getCode() {
		return this.loginCode;
	}

	getStatus() {
		return this.loginStatus;
	}
}

