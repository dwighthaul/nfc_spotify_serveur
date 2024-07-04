const express = require('express');
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