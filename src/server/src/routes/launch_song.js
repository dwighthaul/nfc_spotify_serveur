const { Router } = require('express');
const router = Router();

const request = require('request');

const id_device = `24108c66d1e10306791f56d29d7f220cef0587cf`;


router.get('/', function (req, res) {

    console.log('Lancement de la playlist : ' + req.query.playlist_uri + ' sur le device : ' + req.query.id_device);

    const options = {
        url: "https://api.spotify.com/v1/me/player/play",
        device_id: req.query.id_device,
        body: {
            "context_uri": req.query.playlist_uri,
            "offset": {
                "position": 0
            },
            "position_ms": 0
        },
        headers: {
            "Authorization": "Bearer " + req.session.accessTokenBearer,
        },
        json: true
    };


    request.put(options, (error, reponse, body) => {
        console.log("Lancé")
    })
});



module.exports = router;