const path = require('path');
const dotenv = require('dotenv');

console.log("process.env.NODE_ENV : " + process.env.NODE_ENV)

const pathURL = `./../.env.${process.env.NODE_ENV}`

console.log("pathURL : " + pathURL)

require('dotenv').config({ "path": path.resolve(__dirname, pathURL.trim()) })

