const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'app.js'),
    output: {
        path: path.join(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },
    target: 'node'    
}