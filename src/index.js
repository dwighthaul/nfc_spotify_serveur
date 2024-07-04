const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const SQLConnection = require('./controller/SQLConnection');
const user = require('./routes/user');
const spotify = require('./routes/spotify');
const userRuntimeDataHandler = require("./userRuntimeDataHandler");
require('./configuration/config.js');
const ServerConfig = require('./configuration/ServerConfig.js');

const app = express();


const serverConfig = new ServerConfig(app);
serverConfig.initMiddlewares();
serverConfig.initSession();
serverConfig.initRoutes();
serverConfig.initDatabase();

const port = process.env.SERVEUR_PORT;



app.listen(port, '0.0.0.0', () => {
	console.log(`Example app listening on port ${port}`)
})