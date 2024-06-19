
const AuthSpotify = require('./authSpotify');
const request = require('request');
// Il s'agit d'un controller, on reverra pour le nom... 

const logContext = "[ProxySpotify] ";

module.exports = class ProxySpotify { // Quand on utilisera spotify on derivera d'une classe MusicProxy qui declare les fcts suivantes
    constructor(authSpotify) {
        this.m_authSpotify = authSpotify;
    }

    getDevices(req, res, userSpotifyData, retries = 1) {
        /// Récupérer les arguments
        if (!userSpotifyData) {
            return res.statusCode(500).send("Impossible to get user Spotify data");
        }
        const bearer = userSpotifyData.currentAccessTokenBearer;


         /// Construire la requête
        const options = {
            url: 'https://api.spotify.com/v1/me/player/devices',
            headers: {
                'Authorization': "Bearer " + userSpotifyData.currentAccessTokenBearer,
            },
            json: true  
        };

        /// Envoyer la requête
        request.get(options, (error, response, body) => {
            handle_response_and_send_to_client(
                error, response, retries,
                (retries_)=> {getDevices(req, res, retries_)},
                () => {
                    currentAccessTokenBearer.clientId = body.id;
                    res.send(body);
                }, 
                (statusCode, message) => {  // error
                    res.statusCode(statusCode).send(message);
                }
            )
        });
    }


    launchPlaylist(req, res, userSpotifyData, retries = 1) {
        /// Récupérer les arguments
        if (!userSpotifyData) {
            return res.statusCode(500).send("Impossible to get user Spotify data");
        }
        const bearer = userSpotifyData.currentAccessTokenBearer;
        const playlistUri = req.query.playlist_uri;
        const deviceId = req.query.id_device;
        if (!playlistUri && deviceId) {
            res.status(400).send('Missing parameter(s)');
            return;
        }

        /// Construire la requête
        const options = {
            url: "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId,
            body: {
                "context_uri": playlistUri,
                "offset": { "position": 0 },
                "position_ms": 0
            },
            headers: {
                "Authorization": "Bearer " + bearer,
            },
            json: true
        };
        
        /// Envoyer la requête
        request.put(options, (error, response, body) => {
            handle_response_and_send_to_client(
                error, response, retries,
                (retries_)=> {launchSongs(req, res, retries_)}, 
                () => {
                    res.status(200).send("Playlist successfully started");
                }, 
                (statusCode, message) => {  // error
                    res.statusCode(statusCode).send(message);
                }
            );
        });
    }


    getPlaylists(req, res, userSpotifyData, retries = 1) {
        if (!userSpotifyData) {
            return res.statusCode(500).send("Impossible to get user Spotify data");
        }
        // TODO : voir remarque-general.txt - 1
        // TODO : voir si je peux basculer ça en async/promise
        getInfosUser(req, res, userSpotifyData, (body) => {
            /// Récupérer les arguments
            const userId = body.id;
            if (!userId) {
                res.status(400).send('Could not get userId');
                return;
            }
    
             /// Construire la requête
            const options = {
                url: "https://api.spotify.com/v1/users/" + userId + "/playlists",
                headers: {
                    "Authorization": "Bearer " + userSpotifyData.currentAccessTokenBearer,
                },
                json: true
            }
    
            /// Envoyer la requête
            request.get(options, (error, response, body) => {
                handle_response_and_send_to_client(
                    error, response, retries,
                    (retries_)=> {getInfosUser(req, res, retries_)}, 
                    () => {
                        res.send(body);
                    }, 
                    (statusCode, message) => {  // error
                        res.statusCode(statusCode).send(message);
                    }
                );
            });
        })
    }  

    #getInfosUser(req, res, userSpotifyData, callback, retries = 1)
    {
        /// Récupérer les arguments
        const bearer = userSpotifyData.currentAccessTokenBearer;

        /// Construire la requête
        const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': "Bearer " + bearer,
            },
            json: true  // si on ne met pas ce champ il faut parser le body avec JSON.parse(body)     
        };

        /// Envoyer la requête
        request.get(options, (error, response, body) => {
            handle_response_and_send_to_client(
                error, response, retries, 
                (retries_)=> {getInfosUser(req, res, callback, retries_)},
                () => {
                    callback(body);
                }, 
                (statusCode, message) => { // error
                    res.statusCode(statusCode).send(message);
                }
            );
        });
    }

    // La callback defini le send qu'on va faire client
    #handle_response_and_send_to_client(error, response, retries, original_request, callbackSuccess, callbackError)
    {
        if (!error) {
            // TODO : décider ce qu'il faut return lors d'une erreur request spotify server (500 ou response.codeStatus)
            callbackError(500, logContext + "Error from spotify server");
            return;
        }
        
        // Succes
        if (response.statusCode === 200)  
        {
            callbackSuccess();
            return ;
        } 
        // Le token a expiré, il nous en faut un nouveau
        else if (response.statusCode === 401)  
        {
            if (retries > 0) {
                this.m_authSpotify.get_new_acces_token(userSpotifyData.clientId, userSpotifyData.clientSecret)
                .then(() => {
                    // Relance la requête original mais en décrementant le nombre d'essai
                    // On n'utilise pas un postfix decrement operator donc on est bon
                    original_request(retries - 1);
                    console.warn(logContext + "Orignal_request must always end with a return");              
                })
                .catch((error) => {
                    callbackError(401, error);
                    return;
                })
            }
            else {
                callbackError(401, logContext + "Could not connect to Spotify");
                return;
            }
        }
        // Default case
        callbackError(response.statusCode, logContext + "Unexpected response from Spotify");
        return;
    } 
}

   