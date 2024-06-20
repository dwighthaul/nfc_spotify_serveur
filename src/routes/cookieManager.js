const { Router } = require('express');
const router = Router();

// Classe de test qui permets de tester les cookies


router.get('/get-cookie', (req, res) => {
	console.log('=============');
	console.log(req.session);
	console.log('=============');

	const user = req.session;

	res.json(user);
});

router.get('/set-cookie', (req, res) => {
	req.session.test = "IIIII"

	const user = req.session;

	res.json(user);
});

router.get('/set-cookie-authorisation', (req, res) => {
	req.session.user = {
		id: 1,
		permissions: "read_users,update_user,spotify_login,spotify_run"
	}

	const user = req.session;

	res.json(user);
});

module.exports = router