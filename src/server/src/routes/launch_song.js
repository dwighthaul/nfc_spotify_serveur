const { Router } = require('express');
const router = Router();

const request = require('request');

// Gestionnaire de route pour lancer la lecture d'une playlist Spotify sur un appareil spécifique.
router.get('/', function (req, res) {

    // Extraction de l'URI de la playlist et de l'identifiant de l'appareil à partir des paramètres de requête.
    const playlistUri = req.query.playlist_uri;
    const deviceId = req.query.id_device;
    console.log(req.query)

    // Construction des options de requête pour lancer la lecture de la playlist.
    const options = {
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId,
        body: {
            "context_uri": playlistUri,
            "offset": { "position": 0 },
            "position_ms": 0
        },
        headers: {
            "Authorization": "Bearer " + req.session.accessTokenBearer,
        },
        json: true
    };

    // Effectue une requête PUT à l'API Spotify pour démarrer la lecture.
    request.put(options, (error, response, body) => {
        //console.log(response)
        console.log(body)
        if (error) {
            console.error("Erreur lors du démarrage de la lecture:", error);
            return res.status(500).send("Erreur lors du démarrage de la lecture");
        }
        console.log("Lecture démarrée avec succès");
        res.status(200).send("Lecture démarrée avec succès");
    });
});

module.exports = router;