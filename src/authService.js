const https = require('node:https');
const request = require('request');

var redirect_uri = 'http://localhost:3000/authCredential';
const querystring = require('node:querystring');
const { url } = require('node:inspector');
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

		var state = "OzeSpnW3t00EsMKwj";
		var scope = 'user-read-private user-modify-playback-state user-read-playback-state';

		console.log('hello world');
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

	lancerPlaylist(callback) {

		console.log('lancerPlaylist')
		console.log('lancerPlaylist : id_device : ' + id_device)
		console.log('lancerPlaylist : this.accessTokenBearer : ' + this.accessTokenBearer)

		const options = {
			url: "https://api.spotify.com/v1/me/player/play?device_id=50c14080a6b470701bbf7baada526a6133acc4da",
			body: {
				"context_uri": "spotify:playlist:0SKGWgZ9q7TMHAVlJJVCxG",
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


		request.put(options, (error, reponse, body) => {
			console.log(error)
			console.log("Lanc�")
			console.log(body)
			callback(reponse.statusCode, reponse.body)

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

	// var crypto = require('crypto');

// const generate_state = () => {
//     return crypto
//     .randomBytes(60)
//     .toString('hex')
//     .slice(0, 16);
//   }
}


// module.exports = class User {
//     // TODO : Il y aura une gestion user_app/user_soptify qui nous permettra de faire le lien
//     client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';
//     client_secret = 'dea14dbcfe904185b99bee1d5d75ede5';

//     access_token
//     refresh_token
// }
