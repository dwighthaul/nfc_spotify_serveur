const { Router } = require('express');
const router = Router();

const request = require('request');


// j'avais mis un if (if non definit aller le chercher, mais commec'est asynchrone j'appelais le get_playlist avant)
// Faudra réussir a le gerer, c'est pas opti d'appeler cette fct a chaque fois 
// TODO : gerer le cas ou le bearer n'a pas été obtenu
// Necesitte d'avoir le bearer des la connexion du user sur le serveur

router.get('/hello', function (req, res) {
    console.log(req.session.id);
    console.log("HEYYYYYYYYYYYYYYYY");
})


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