const { Router } = require('express');
const router = Router();


app.get('/userLogin', (req, res) => {
	authSpotify.clientId = 'b6df1ac233ea4d359790c9a95ccb1ebb';
	authSpotify.auth(req,res);
	// TODO : on perd le flow de contrôle avec cette redirection
    // 		  ça serait bien si on pouvait avoir une callback sur succès
});