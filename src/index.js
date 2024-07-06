const express = require('express');
const ServerConfig = require('./configuration/ServerConfig2.js');
require("./configuration/config.js")
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