const { Router } = require('express');
const router = Router();

const querystring = require('node:querystring');
const request = require('request');

// Seront définis plus tard en bdd quand on aura la gestion de user/login
var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';


var redirect_uri = 'http://localhost:3000/authCredential';

module.exports = class AuthSpotify {
	m_clientId = "";
    m_cliendSecret = "";
    
    constructor() {
	}

    setClientInfos(clientId,cliendSecret) 
    {
        m_clientId = clientId;
        m_cliendSecret = cliendSecret;
    }

    //var scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-collaborative playlist-read-private';
    auth(scopes, req, callback) {
        // TODO : definir random state
        var state = "OzeSpn73t00EsMKwKdfr";
       
        var scope = scopes.map(str => {}).join(' ');
       
        // TODO : ça sert à quoi deja ? (pourquoi on le defini dans la requete et pas niveau serveur ?)
         req.session.redirect_url = req.query.redirect_url;
    
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: m_client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            }));
    }
    
    
    get_credential_spotify(req, callback) {
        req.session.loginCode = req.query.code
        req.session.loginStatus = req.query.state

        const options = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: req.session.loginCode,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                // TODO : why there is a token hardcoded ? 
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


// Make a call to the server to get a new acces_token
 get_new_acces_token() 
{
    const refreshTokenHasBeenDefined = (req?.session?.refreshToken !== undefined);
    if (!refreshTokenHasBeenDefined) { // Impossible de re-avoir un acces-token sans refresh-token
        //immediately returns a rejected Promise with an error message.
        return Promise.reject('No refresh token defined');
    }

    // TODO : replace Authorization by a clean gestion of clientId and clientServer
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 
          'content-type': 'application/x-www-form-urlencoded',
          
          'Authorization': "Basic YjZkZjFhYzIzM2VhNGQzNTk3OTBjOWE5NWNjYjFlYmI6ZGVhMTRkYmNmZTkwNDE4NWI5OWJlZTFkNWQ3NWVkZTU="
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: req.session.refreshToken  // Existence has been checked before 
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request.post(authOptions, function(error, response, body) {
            if (error) {
                // Est ce qu'on veut que l'erreur de cette requete soit considéré comme une erreur de notre serveur ?? 
                reject(error.message);
            } 
            else if (response.statusCode === 200) {
                var access_token = body.access_token;
                var refresh_token = body.refresh_token;
                resolve({
                    'succes': true,
                    'access_token': access_token,
                    'refresh_token': refresh_token
                });
            }
            else {
                // If the response is not successful, resolve with an error message
                resolve({ 
                    message: statusMessage,
                    statusCode:  response.statusCode,
                });
            }
        });
    });
}



    // Gerer le cas de deconnection 
 
    
    // router.get('/auth', (req, res) => {
    //     res.send({ accessTokenBearer: req.session.accessTokenBearer, loginCode: req.session.loginCode, loginStatus: req.session.loginStatus })
    // })
}






