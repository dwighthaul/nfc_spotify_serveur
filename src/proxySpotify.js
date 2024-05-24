
// Regroupe l'ensemble des fonctions qui permet d'envoyer des fonctions a spotify 

// Comment est ce j'utilise une reference a AuthSpotify ? 
// Je dois recuperer une instance non ? 



module.exports = class ProxySpotify { // Quand on utilisera spotify on derivera d'une classe MusicProxy qui declare les fcts suivantes
    authSpotify;
    //getDevices()

    launchSongs(req, callback, maxTryReco = 1)
    {
        request.put(options, (error, response, body) => {
            if (!error) {
                // TODO : décider ce qu'il faut return lors d'une erreur request spotify server
                // statusCode 500 ou on transmet le status code du serveur ? 
            }
            // Maybe token expire, we get a new token and we retry
            else if (response.statusCode === 401) {
                authSpotify(launchSongs(req, callback, maxTryReco - 1 ))
            }
            // Succes
            else if (response.statusCode === 200) {
                
            } 
            else {

            }
        });
    }


    //getPlaylists()
       
        // Cette fonction sert seulement pour obtenir les playlists
        //getInfosUser()


}