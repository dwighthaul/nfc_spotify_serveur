const { Router } = require('express');
const router = Router();


const SQLConnection = require('./../controller/SQLConnection');
const userController = require('./../controller/UserController');
const authentication = require('./../controller/Authentication');
const nfcTagsController = require('./../controller/NFCTagsController');
const userRuntimeDataHandler = require("./../userRuntimeDataHandler");
const { UserSpotifyData } = require("./../authSpotify");
const rbacMiddleware = require('./../middleware/rbacMiddleware');


router.get('/getUsers', (req, res) => {
	userController.getUsers().then((data) => {
		res.send(data);
	});
});


router.get('/getUsersSecure', rbacMiddleware.checkPermission("read_users"), (req, res) => {
	userController.getUsers().then((data) => {
		res.send(data);
	});
});

router.get('/getTags', (req, res) => {
	nfcTagsController.getTags().then((data) => {
		res.send(data);
	});
});




// TODO : voir ce qui est la best practice, le server gere la session ou le client (et il envoie le username en parametre)
// A priori les get ne prenent pas de body donc c'est plus simple si je laisse le serveur gérer
router.get('/getClientIdAndSecret', (req, res) => {
	const username = req.session?.user?.id ?? '';
	userController.getClientIdAndSecret(username).then((data) => {
		// Pour Paul : j'ai eu un gros soucis avec ça, si je stringify pas ton code du client ne l'accepte pas
		// Je savais pas si je dois adapter pour que le client fit le serveur ou inversement 
		// J'ai choisis le serveur vu qu'on utilisait deja ta fct un peu partout sur le côté client 
		if (data) {
			const response = {
				"clientId": data.clientId,
				"clientSecret": data.clientSecret
			};
			res.json(response);
		} else {
			res.json({});
		}

	});
});


router.post('/login', (req, res) => {
	authentication.verifyLogin(req.body.username, req.body.password, (result) => {
		if (result.status === "KO") {
			res.sendStatus(401).send(result.data)
			return;
		}
		if (result.status === "OK") {
			let user = result.data;
			req.session.user = user;

			console.log("user : ", user.id)

			userController.getClientIdAndSecret(user.id)
				.then((data) => {
					const userSpotifyData = new UserSpotifyData(data.clientId, data.clientSecret);
					userRuntimeDataHandler.addUser(result.data.id, userSpotifyData);
				})
				.finally(() => {
					res.send(result.data);
				});
		}
	});
});




router.post('/logout', (req, res) => {
	delete req.session.user
	res.sendStatus(200)

});


router.get('/getSession', (req, res) => {
	const user = req.session;
	res.json(user);
});




router.post('/updateSettings', (req, res) => {
	console.log('Update Settings')
	// TODO : voir ce qui est la best practice, le server gere la session ou le client (et il envoie le username en parametre)
	const username = req.session?.user?.username ?? '';
	userController.updateSettings(req.body.clientId, req.body.clientSecret, username, (result) => {
		res.sendStatus(200);
	});
});


module.exports = router;