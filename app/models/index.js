const glob = require('glob');
const mongoose = require('mongoose');

const modelsFiles = './*.model.js'

module.exports = (app) => {
    const db = mongoose.connection;
    mongoose.connect('mongodb://localhost/asset_manager');
    db.on('error', (err) => {
        console.error(err);
    });

    db.on('open', () => {
        console.log('DB connected');
    });

    glob(modelsFiles, (err, files)=>{
        files.forEach((file) => {
            require(file)(app);
        });
    });

};