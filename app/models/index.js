const glob = require('glob');
const path = require('path');

const modelsFiles = path.join(__dirname, '*.model.js');

//db: {user: {}, basket: {},,,}
let db = {};
module.exports = (mongoose) => {
    if(Object.keys(db).length===0){
        glob.sync(modelsFiles).forEach((file) => {
            var model = require(file)(mongoose);
            db[model.modelName] = model;
        });
    }
    return db;
};

//single of models must be used with node's exports, 
//so that the models can be cached in node and never called second time,
//if use module.exports = ()=>{}, this will call the function everytime, and 
//recreate another new model, and this new model will rely on the connection,
//that will make a huge mess, model's function might hang after the api call 

//problem in mongoose:
//I think require('mongoose') will generate new mongoose instance, and whatever models bind to this new instance will wait for this instance connect to db, otherwise they just hang up forever.
//so whenever use mongoose, better just require('mongoose') once, and always use this instance