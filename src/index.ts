import express from 'express';
import ServerConfig from './configuration/ServerConfig';


require("./configuration/config")
const app = express();




const serverConfig = new ServerConfig(app);
serverConfig.initMiddlewares();
serverConfig.initSession();
serverConfig.initRoutes();
serverConfig.initDatabase();

const port = process.env.SERVEUR_PORT;



app.listen(Number.parseInt(port), '0.0.0.0', () => {
	console.log(`Example app listening on port ${port}`)
})