import { Router } from 'express';
import { AuthSpotify } from '../authSpotify';
import { ProxySpotify } from '../proxySpotify';
import userRuntimeDataHandler = require("./../userRuntimeDataHandler");

const authSpotify = new AuthSpotify();
const proxySpotify = new ProxySpotify(authSpotify);


const router = Router();


const reloadSession = (req, res, next) => {
    req.sessionStore.get(req.query.state, (err, session) => {
        Object.assign(req.session, session);
        console.debug("User trouve : ", req.session.user.id, " - ", req.session.user.username)
        getUserSpotifyData(req, res, next);
    })
}



// Middleware pour récupérer les infos du user connecté
const getUserSpotifyData = (req, res, next) => {
    // Je me sers de la session pour récupérer le data
    // TODO : vérifier que ça renvoie bien un objet non défini si le user n'est pas connecté

    console.log("ID : ", req.session.user?.id)
    if (req?.session?.user?.id) {
        req.userSpotifyData = userRuntimeDataHandler.getUserDataSpotify(req.session.user.id);
    }
    next();
};


router.get('/authCredential', reloadSession, (req, res) => {
    authSpotify.get_credential_spotify(req, res, req.userSpotifyData);
})



router.get('/login', getUserSpotifyData, (req, res) => {
    authSpotify.auth(req, res, req.userSpotifyData);
})


router.get('/devices', getUserSpotifyData, (req, res) => {
    proxySpotify.getDevices(req, res, req.userSpotifyData);
})


router.get('/launchPlaylist', getUserSpotifyData, (req, res) => {
    proxySpotify.launchPlaylist(req, res, req.userSpotifyData);
})


router.get('/playlists', getUserSpotifyData, (req, res) => {
    proxySpotify.getPlaylists(req, res, req.userSpotifyData);
})



export = router;