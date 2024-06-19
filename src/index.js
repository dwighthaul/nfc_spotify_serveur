const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const SQLConnection = require('./controller/SQLConnection');
const user = require('./routes/user');
const spotify = require('./routes/spotify');
const userRuntimeDataHandler = require("./userRuntimeDataHandler")
const app = express();
const port = process.env.SERVEUR_PORT;

//console.log(process.env.CLIENT_ENDPOINT)

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_ENDPOINT}`);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});


let c = new SQLConnection();
c.connect().then(() => {
	c.syncDatabase()
})



// Module installé recemment cors, memorystore
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(
	session({
		secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60000 }, // value of maxAge is defined in milliseconds. 
	})
);

// TODO : polo propose de faire un parser qui prend le coockie et l'eclate en instance 
// dans la gestion du coockie on peut mettre httpOnly:true et si on le fait le client ne peut pas les modifier
// ça regle le soucis de gerer la deconnection quand ça timeout

// la session n'est pas envoyé au client (seulement le coockie avec l'id du user)

app.use((req, res, next) => {
	if (req.session?.cookie && req.session.cookie.expires > Date.now())
	{
		// TODO : ça me plait pas trop qu'on ai connaissance ici d'une route encapsulé dans user..
		//return res.redirect('/user/login');
		userRuntimeDataHandler.delUser();
	} 
	next(); 
  });


app.use('/spotify/', spotify);
app.use('/user/', user);


app.get('/', (req, res) => {
	res.send(req.session);
})


app.get('/test', (req, res) => {
	//console.log("TOTO") 
	res.send({ hello: "world" });
})


app.listen(port, '0.0.0.0', () => {
	//console.log(`Example app listening on port ${port}`)
})