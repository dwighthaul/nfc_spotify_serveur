const { Router } = require('express');
const router = Router();



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

module.exports = router