const express = require('express');
const path = require('path');

console.log("process.env.NODE_ENV : " + process.env.NODE_ENV)

const NODE_ENV = process.env.NODE_ENV.trim()
console.log("Lancement du serveur avec la config suivante : " + NODE_ENV + '--')

const pathURL = `./../.env.${NODE_ENV}`

console.log("Lancement du serveur avec la config suivante : " + pathURL + '--')

require('dotenv').config({ "path": path.resolve(__dirname, pathURL) })

const ServerConfig = require('./configuration/ServerConfig2.js');

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