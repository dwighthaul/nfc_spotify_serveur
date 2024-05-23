const request = require('request');
const querystring = require('node:querystring');

var redirect_uri = `${process.env.SERVEUR_ENDPOINT}:${process.env.SERVEUR_PORT}/authCredential`;
var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';


module.exports = class Auth {
	constructor() {
	}

	auth(req, callback) {
		console.log(req.session.loginCode)
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: req.session.loginCode,
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
			req.session.accessTokenBearer = body.access_token;
			callback();
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
		req.session.loginCode = req.query.code
		req.session.loginStatus = req.query.state

		this.auth(req, () => {
			console.log("Auth OK")
			callback()
		})
	}

}

