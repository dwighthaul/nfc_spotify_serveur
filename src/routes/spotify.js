const { Router } = require('express');
const router = Router();
const { AuthSpotify } = require('./../authSpotify');
const ProxySpotify = require('./../proxySpotify');
const userRuntimeDataHandler = require("./../userRuntimeDataHandler");

const authSpotify = new AuthSpotify();
const proxySpotify = new ProxySpotify(authSpotify);





// Middleware pour récupérer les infos du user connecté
const getUserSpotifyData = (req, res, next) => {
    // Je me sers de la session pour récupérer le data
    // TODO : vérifier que ça renvoie bien un objet non défini si le user n'est pas connecté
    req.userSpotifyData = userRuntimeDataHandler.getUserDataSpotify(req.session.user.id);
    next();
};


router.get('/authCredential', getUserSpotifyData, (req, res) => {
    authSpotify.get_credential_spotify(req, res, req.userSpotifyData);
})



router.get('/login', getUserSpotifyData, (req,res) => {
    authSpotify.auth(req,res, req.userSpotifyData);
})


router.get('/devices', getUserSpotifyData, (req, res) => {
    proxySpotify.getDevices(req, res, req.userSpotifyData);
})


router.get('launchPlaylist', getUserSpotifyData, (req,res) => {
    proxySpotify.launchPlaylist(req, res, req.userSpotifyData);
})


router.get('playlists', getUserSpotifyData, (req,res) => {
    proxySpotify.getPlaylists(req, res, req.userSpotifyData);
})



module.exports = router;