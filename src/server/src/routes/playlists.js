const { Router } = require('express');
const router = Router();

const request = require('request');


router.get('/', function (req, res) 
{
    // j'avais mis un if (if non definit aller le chercher, mais commec'est asynchrone j'appelais le get_playlist avant)
    // Faudra réussir a le gerer, c'est pas opti d'appeler cette fct a chaque fois 
   
    // TODO : gerer le cas ou le bearer n'a pas été obtenu
    // Necesitte d'avoir le bearer des la connexion du user sur le serveur
    const bearer = req.session.accessTokenBearer;
    console.log("HEYYYYYYYYYYYYYYYY");
    console.log(bearer);
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': "Bearer " + req.session.accessTokenBearer,
        },  
        json: true  // si on ne met pas ce champ il faut parser le body avec JSON.parse(body)     
    };
    request.get(options, (error, response, body) => {
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
            const items = body.items;
            const dropdownHTML = `
            <select id="itemDropdown">
                <option value="">Select an item</option>
                ${items.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}
            </select>
            `;
            res.send(dropdownHTML);
        });
    });
})



module.exports = router;