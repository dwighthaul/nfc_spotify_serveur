import { Router } from 'express';
import { AuthSpotify } from '../authSpotify';
import { nfcTagsController } from '../controller/db/NFCTagsController';
import { RequestSpotifyDTO } from '../model/dto/RequestSpotifyDTO';
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

    console.debug("ID : ", req.session.user?.id)
    if (req?.session?.user?.id) {
        req.userSpotifyData = userRuntimeDataHandler.getUserDataSpotify(req.session.user.id);
    }
    next();
};


router.get('/authCredential', reloadSession, (req: RequestSpotifyDTO, res) => {
    authSpotify.get_credential_spotify(req, res, req.userSpotifyData);
})



router.get('/login', getUserSpotifyData, (req: RequestSpotifyDTO, res) => {
    authSpotify.auth(req, res, req.userSpotifyData);
})


router.get('/devices', getUserSpotifyData, (req: RequestSpotifyDTO, res) => {
    proxySpotify.getDevices(req, res, req.userSpotifyData);
})


router.get('/launchPlaylist', getUserSpotifyData, (req: RequestSpotifyDTO, res) => {
    proxySpotify.launchPlaylist(req, res, req.userSpotifyData);
})


router.get('/playlists', getUserSpotifyData, (req: RequestSpotifyDTO, res) => {
    proxySpotify.getPlaylists(req, res, req.userSpotifyData);
})

router.get('/launchPlaylistFromTagId', getUserSpotifyData, (req: RequestSpotifyDTO, res) => {

    var tagId = req.query.id_tag;

    console.log("Tag Id envoye : ", tagId)

    nfcTagsController.getTagById(Number.parseInt(tagId)).then((tag) => {
        if (tag && tag.playlistId) {
            console.log("Tag trouve : ", tag);
            req.query.playlist_uri = tag.playlistId;
            req.query.id_device = tag.deviceId;
            proxySpotify.launchPlaylist(req, res, req.userSpotifyData);
        }
    })

})


export = router;