const { Router } = require('express');
require('dotenv').config()



const router = Router();
const querystring = require('node:querystring');
const request = require('request');

// Seront définis plus tard en bdd quand on aura la gestion de user/login
var client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';

// ça commence a me faire regretter d'avoir encapsuler get_credential_spotify dans une fonction..
var redirect_uri = `${process.env.SERVEUR_ENDPOINT}/authCredential`;


router.get('/', function (req, res) {
    console.log("session id debut TT=", req.session.id, redirect_uri);
    var state = "OzeSpn73t00EsMKwKdfr";
    // aide spotify a savoir les autorisations dont on va avoir besoin
    // TODO : la validation se fait lors d ela requpete donc il faut le faire via la web-interface avant de pouvoir utiliser le tag nfc
    var scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-collaborative playlist-read-private';
    req.session.redirect_url = req.query.redirect_url;
    console.log("Demande d'autorisation a spotify et redirection vers : " + redirect_uri)

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
        const now = new Date();
        const currentTimeInMs = now.getTime();
        console.log(currentTimeInMs);
        req.session.expires_at =  Math.floor(currentTimeInMs / 1000) + body.expires_in;
        res.send("<script>window.close();</script >");
    });

}

router.get('/token_expire_at', (req, res) => {
    res.send(req.session?.expires_at ?? 0);
});


router.get('/auth', (req, res) => {
    res.send({ accessTokenBearer: req.session.accessTokenBearer, loginCode: req.session.loginCode, loginStatus: req.session.loginStatus })
})


// Make a call to the server to get a new acces_token
function get_new_acces_token() 
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


function resend_request()
{
    // const result = await fn(req, res);
    // if (result === 'retry') {
    //     // Resend the original request with the new token
    //     const originalUrl = req.originalUrl;
    //     const originalMethod = req.method;
    //     const originalHeaders = { ...req.headers, authorization: `Bearer ${req.newToken}` };
    //     const originalBody = req.body;
        
    //     // Set up the options for the fetch call to retry the original request
    //     const options = {
    //         method: originalMethod,
    //         headers: originalHeaders,
    //         body: originalMethod === 'GET' || originalMethod === 'HEAD' ? null : JSON.stringify(originalBody),
    //     };
    
    //     try {
    //         const response = await fetch(`http://localhost:3000${originalUrl}`, options);
    //         const responseData = await response.text();
    //         res.status(response.status);
    //         originalSend(responseData);
    //     } catch (error) {
    //         console.error('Error retrying the request:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // }
     
}


// function intercept401(fn) {

//     return function (req, res, next) {
//         const originalSend = res.send;

//         res.send = function (body) {
//             if (res.statusCode === 401) {
//                 fn(req, res);
//             } 
//             else {
//                 originalSend.call(this, body);
//             }
//         };

//         next();
//     };

//     return function (req, res, next) {
//         const originalSend = res.send;

//         res.send = function (body) {
//             if (res.statusCode === 401) {
//                 get_new_acces_token().then((response) => {
//                     if (response.success) {
//                         resend_request();
//                     } else {
//                         res.status(response.statusCode).send({ error: "Could not get token with refresh-token from spotify" });
//                     }
//                 }).catch((error) => {
//                     res.status(500).send({ error: "Internal when trying to get a new token from Spotify with refresh-token" });
//                 });
//             }
//         };
//         next();
//     };
// }


// Middleware acts as a bridge between the incoming client requests and the outgoing server responses.
// Middleware is primarily applied before the request reaches the intended route handler, so it's before sending the request to the server.
// However, middleware can also be used after the request has been handled by the server's route handlers, but before sending the response back to the client.


// Enfaite de ce que je comprend il me faut un next (faux)

// Finalement middleware en fin d'execution ne semble par etre possible
// Mais il y a une solution https://stackoverflow.com/questions/11335278/how-to-have-a-nodejs-connect-middleware-execute-after-responde-end-has-been-in/21858212#21858212
// ça serait d'écouter sur le finish event 




// {
// const express = require('express');
// const fetch = require('node-fetch');

// const app = express();
// const PORT = 3000;

// function fetchWithRetry(url, options, retries = 3) {
//   return fetch(url, options).then(response => {
//     if (!response.ok && retries > 0) {
//       console.log(`Retrying request to ${url}. Retries left: ${retries}`);
//       return fetchWithRetry(url, options, retries - 1);
//     }
//     return response;
//   });
// }

// // Middleware to resend the request
// function resendRequest(req, res, next) {
//   const { originalUrl, method, body } = req;
//   fetchWithRetry(`http://localhost:3000${originalUrl}`, { method, body })
//     .then(response => response.json())
//     .then(data => {
//       // Send the response received after retrying
//       res.json(data);
//     })
//     .catch(error => {
//       // If retrying fails, send error response
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// }

// // Route that makes a request to an external API
// app.get('/getData', async (req, res, next) => {
//   try {
//     const response = await fetch('https://api.example.com/data');
//     const data = await response.json();
//     res.json(data);
//     // Example condition triggering post-request middleware
//     if (/* Your specific condition here */) {
//       // Call the post-request middleware to resend the request
//       req.shouldRetry = true;
//     }
//     next();
//   } catch (error) {
//     // If an error occurs, pass control to the error-handling middleware
//     next(error);
//   }
// });

// // Post-request middleware triggered based on condition
// app.use((req, res, next) => {
//   if (req.shouldRetry) {
//     // Call the resendRequest middleware to resend the request
//     resendRequest(req, res, next);
//   } else {
//     next();
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// }


app.use(intercept401(get_new_acces_token));


module.exports = { router: router, get_credential_spotify: get_credential_spotify };
// module.exports = router;