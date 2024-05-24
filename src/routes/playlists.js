const { Router } = require('express');
const router = Router();

const request = require('request');

//  TODO : Refacto 
/*
class SpotifyRouring () {
    // Matcher route et fonction a appeler 
    v1/device => Spotify.getDevices()
    v1/playlist => Spotify.getPlaylist()
}
 

class Spotify () {

    private urlSpotify;
    private tokenBearer;
    private idUser;


    login()

    getPlaylist()


}
*/


router.get('/', function (req, res) {
    const bearer = req.session.accessTokenBearer;
    console.log("bearer ?");
    console.log(bearer);
    console.log(req.session.id);
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': "Bearer " + req.session.accessTokenBearer,
        },
        json: true  // si on ne met pas ce champ il faut parser le body avec JSON.parse(body)     
    };
    request.get(options, (error, response, body) => {
        
        console.log(response.statusCode)

        req.session.user_id = body.id;
        const options = {
            url: "https://api.spotify.com/v1/users/" + req.session.user_id + "/playlists",
            headers: {
                "Authorization": "Bearer " + req.session.accessTokenBearer,
            },
            json: true
        }
        request.get(options, (error, response, body) => {
            // ça marchait pas car j'avais oublié de donner le scop mais je trouve que l'erreur est vrmt pas explicite
            console.log(response.statusCode);
            console.log(body?.items?.length);

            res.send(body);
        });
    });
})



module.exports = router;