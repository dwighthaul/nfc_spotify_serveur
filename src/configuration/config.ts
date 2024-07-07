const path = require('path');

console.log("process.env.NODE_ENV : " + process.env.NODE_ENV)

const NODE_ENV = process.env.NODE_ENV.trim()

const pathURL = `./../../.env.${NODE_ENV}`

console.log("Lancement du serveur : " + pathURL)

require('dotenv').config({ "path": path.resolve(__dirname, pathURL.trim()) })

console.log("process.env.SERVEUR_ENDPOINT : ", process.env.SERVEUR_ENDPOINT)