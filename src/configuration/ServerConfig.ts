import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import { SQLConnection } from '../controller/db/SQLConnection';
import cookieManager from '../routes/cookieManager';
import spotify from '../routes/spotify';
import user from '../routes/user';



class ServerConfig {
	// Change en une class
	app: express;

	// Construction a partir des configurations
	constructor(app) {
		this.app = app;
	}

	initMiddlewares() {
		this.app.use(express.static('public'));
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		console.log("Auth depuis le chemin suivant : ", process.env.CLIENT_ENDPOINT)
		console.log("Auth depuis le chemin suivant : ", process.env.CLIENT_ENDPOINT)
		this.app.use((req, res, next) => {
			res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_ENDPOINT}`);
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
			res.setHeader('Access-Control-Allow-Credentials', true);
			next();
		});

		this.app.set('trust proxy', 1);
	}

	initSession() {
		this.app.use(session({
			secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
			resave: false,
			saveUninitialized: true,
			cookie: {
				httpOnly: false,
				secure: (process.env.NODE_ENV === "production"),
				sameSite: (process.env.NODE_ENV === "production") ? 'None' : 'Strict',
				maxAge: 86400000 // 1 day
			}
		}));

		this.app.use((req, res, next) => {
			if (req.session?.cookie && req.session.cookie.expires > Date.now()) {
				// TODO : DelUser existe pas
				// userRuntimeDataHandler.delUser();
			}
			next();
		});
	}

	initRoutes() {
		this.app.use('/spotify/', spotify);
		this.app.use('/user/', user);
		this.app.use('/cookie/', cookieManager);

		this.app.get('/', (req, res) => {
			res.send(req.session);
		});

		this.app.get('/test', (req, res) => {
			res.send({ hello: "world" });
		});
	}

	initDatabase() {
		const c = new SQLConnection();
		c.connect().then(() => {
			c.syncDatabase();
		});
	}


};

export = ServerConfig;
