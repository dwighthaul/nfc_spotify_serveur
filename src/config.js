const path = require('path');
const dotenv = require('dotenv');

console.log("process.env.NODE_ENV : " + process.env.NODE_ENV)

const NODE_ENV = process.env.NODE_ENV.trim()

const pathURL = `./../.env.${NODE_ENV}`

console.log("Lancement du serveur : " + pathURL)

require('dotenv').config({ "path": path.resolve(__dirname, pathURL.trim()) })

