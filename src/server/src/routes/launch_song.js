const { Router } = require('express');
const router = Router();

const request = require('request');

const id_device = `24108c66d1e10306791f56d29d7f220cef0587cf`;


router.get('/', function (req, res) {

	console.log('lancerPlaylist');
    console.log('lancerPlaylist : id_device : ' + id_device);
    console.log('lancerPlaylist : this.accessTokenBearer : ' + req.session.accessTokenBearer);

    const options = {
        url: "https://api.spotify.com/v1/me/player/play",
        device_id: id_device,
        body: {
            "context_uri": "spotify:playlist:0SKGWgZ9q7TMHAVlJJVCxG",
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
        console.log(error)
        console.log("Lancé")
        console.log(body)
        console.log(reponse.statusCode)
        console.log(reponse.body)
    })
});



module.exports = router;