const { Router } = require('express');
const router = Router();

const querystring = require('node:querystring');
const request = require('request');

// Seront définis plus tard en bdd quand on aura la gestion de user/login
var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';

// ça commence a me faire regretter d'avoir encapsuler get_credential_spotify dans une fonction..
var redirect_uri = 'http://localhost:3000/authCredential';


router.get('/', function (req, res) {
    console.log("session id debut =", req.session.id);
    var state = "OzeSpn73t00EsMKwKdfr";
    // aide spotify a savoir les autorisations dont on va avoir besoin
    // TODO : la validation se fait lors d ela requpete donc il faut le faire via la web-interface avant de pouvoir utiliser le tag nfc
    var scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-collaborative playlist-read-private';
    req.session.redirect_url = req.query.redirect_url;

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        }))
});


function get_credential_spotify(req, res) {
    console.log(`Login succes : `)
    console.log(`Code : ` + req.query.code)
    console.log(`State : ` + req.query.state)
    req.session.loginCode = req.query.code
    req.session.loginStatus = req.query.state

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // res.setHeader('Access-Control-Allow-Credentials', true);

    const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.session.loginCode,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            "Authorization": "Basic YjZkZjFhYzIzM2VhNGQzNTk3OTBjOWE5NWNjYjFlYmI6ZGVhMTRkYmNmZTkwNDE4NWI5OWJlZTFkNWQ3NWVkZTU=",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        json: true
    };

    request.post(options, (error, reponse, body) => {
        // TODO : if succes 
        console.log("session id fin =", req.session.id);
        console.log("body.access_token =", body.access_token);
        req.session.accessTokenBearer = body.access_token;
        res.send("<script>window.close();</script >");

    });
}


router.get('/auth', (req, res) => {
    res.send({ accessTokenBearer: req.session.accessTokenBearer, loginCode: req.session.loginCode, loginStatus: req.session.loginStatus })
})


module.exports = { router: router, get_credential_spotify: get_credential_spotify };
// module.exports = router;