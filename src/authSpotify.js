const querystring = require('node:querystring');
const request = require('request');

const logContext = "[NewToken] ";
// Seront définis plus tard en bdd quand on aura la gestion de user/login
var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';


var redirect_uri = 'http://localhost:3000/spotify/authCredential';


class UserSpotifyData {
    constructor(clientId, cliendSecret) { this.clientId = clientId; this.cliendSecret = cliendSecret;}
    clientId = "";
    cliendSecret = "";
    currentAccessTokenBearer = "";
};


class AuthSpotify 
{
    // TODO : c'est mal géré :
    // suggestion : il faut un bool spotify_is_set, spotify_is_connected dans la session ce qui permettrait de prendre des decissions 
    // Pour l'instant c'est le client qui décide si il lance la page spotify (contrainte technique)
    // Mais ça devrait plus être le server 
    auth(req, res, userSpotifyData) {
        /// Récupérer les arguments
        //console.log('Cliend_id', userSpotifyData?.clientId);
        if (!userSpotifyData?.clientId) {
            res.status(500).send('Cliend_id is missing');
            return;
        }

        // TODO : definir random state
        var state = "OzeSpn73t00EsMKwKdfr";
        var scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-collaborative playlist-read-private';
        //var scope = scopes.map(str => {}).join(' ');
       
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: userSpotifyData.clientId,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            }));
    }
    
    get_credential_spotify(req, res, userSpotifyData) {
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
            console.log(userSpotifyData);
            userSpotifyData.currentAccessTokenBearer = body.access_token;
            // TODO : faire coté client une bien meilleur interface
            res.send("<script>window.close();</script >");
        });
    }


    // Recupere un nouveau access-token
    get_new_acces_token(clientId, cliendSecret) 
    {
        /// Récupérer les arguments
        const refreshTokenHasBeenDefined = (req?.session?.refreshToken !== undefined);
        if (!refreshTokenHasBeenDefined) { // Impossible de re-avoir un acces-token sans refresh-token
            return Promise.reject('No refresh token defined');
        }
        const basicBearer = this.#BasicBearer(clientId, cliendSecret);
        if (basicBearer === "") {
            return Promise.reject('Could not get basic bearer'); 
        }

        /// Construire la requête
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': "Basic " + basicBearer
            },
            form: {
            grant_type: 'refresh_token',
            refresh_token: req.session.refreshToken  // Existence has been checked before 
            },
            json: true
        };

        /// Envoyer la requête 
        return new Promise((resolve, reject) => {
            request.post(authOptions, function(error, response, body) {
                if (error) {
                    reject(error.message);
                } 
                else if (response.statusCode === 200) {
                    const access_token = body.access_token;
                    const refresh_token = body.refresh_token;
                    resolve({
                        'access_token': access_token,
                        'refresh_token': refresh_token
                    });
                }
                else {
                    reject(logContext + "Unexpected response from Spotify");
                }
            });
        });
    }

    #BasicBearer(clientId, clientSecret)
    {
        if(clientId === "" || cliendSecret==="") {
            return "";
        }
        return Buffer.from(clientId + ':' + clientSecret).toString('base64');
    }
    
}


module.exports = {UserSpotifyData, AuthSpotify };





