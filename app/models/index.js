const glob = require('glob');
const path = require('path');

const modelsFiles = path.join(__dirname, '*.model.js');

module.exports = () => {
    const db = {};
    glob(modelsFiles, (err, files)=>{
        if(err){
            console.error(err);
            return;
        }
        files.forEach((file) => {
            var model = require(file);
            db[model.modelName] = model;
        });
    });
    return db;
};