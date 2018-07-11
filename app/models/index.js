const glob = require('glob');
const path = require('path');
const mongoose = require('mongoose');

const modelsFiles = path.join(__dirname, '*.model.js');

const conn = mongoose.connection;
mongoose.connect('mongodb://localhost/asset_manager', {useMongoClient: true});

conn.on('error', (err) => {
    console.error(err);
});

conn.on('open', () => {
    console.log('DB connected');
});


module.exports = () => {
    const db = {};
    glob(modelsFiles, (err, files)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log(files);
        files.forEach((file) => {
            var model = require(file);
            console.log(model.modelName);
            // db[require(file)(app);
        });
    });
    return db;
};