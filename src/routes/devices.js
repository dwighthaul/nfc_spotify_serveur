const { Router } = require('express');
const router = Router();

const request = require('request');


router.get('/', function (req, res) {
	const options = {
		url: 'https://api.spotify.com/v1/me/player/devices',
		headers: {
			'Authorization': "Bearer " + req.session.accessTokenBearer,
		},
		json: true  // si on ne met pas ce champ il faut parser le body avec JSON.parse(body)     
	};
	request.get(options, (error, response, body) => {
		console.log(response.statusCode)
		req.session.user_id = body.id;
		res.send(body);
	});
})



module.exports = router;