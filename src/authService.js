const https = require('node:https');

module.exports = class Auth {

	accessTokenBearer;

	constructor() {
	}

	auth(callback) {

		const options = {
			hostname: 'accounts.spotify.com',
			path: '/api/token?grant_type=client_credentials',
			method: 'POST',
			headers: {
				"Authorization": "Basic YjZkZjFhYzIzM2VhNGQzNTk3OTBjOWE5NWNjYjFlYmI6ZGVhMTRkYmNmZTkwNDE4NWI5OWJlZTFkNWQ3NWVkZTU=",
				"Content-Type": "application/x-www-form-urlencoded",
			}
		};

		const reqAuth = https.request(options, (resAuth) => {
			console.log('statusCode auth :', resAuth.statusCode);

			resAuth.on('data', (data) => {
				var result = JSON.parse(data)
				this.accessTokenBearer = result.access_token
				callback()
			});
		});

		reqAuth.on('error', (e) => {
			callback()

		});
		reqAuth.end();
	};

	getBearer() {
		return this.accessTokenBearer;
	}

}

