const path = require('path');

console.log("process.env.NODE_ENV : " + process.env.NODE_ENV)

const NODE_ENV = process.env.NODE_ENV.trim()
console.log("Lancement du serveur avec la config suivante : " + NODE_ENV + '--')

const pathURL = `./../../.env.${NODE_ENV}`

console.log("Chargement du fichier de config : ", path.resolve(__dirname, pathURL))

console.log("Lancement du serveur avec la config suivante : " + pathURL + '--')

require('dotenv').config({ "path": path.resolve(__dirname, pathURL) })

