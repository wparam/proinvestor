const glob = require('glob');
const path = require('path');

const modelsFiles = path.join(__dirname, '*.model.js');

glob.sync(modelsFiles).forEach((file) => {
    var model = require(file);
    exports[model.modelName] = model;
});

//single of models must be used with node's exports, 
//so that the models can be cached in node and never called second time,
//if use module.exports = ()=>{}, this will call the function everytime, and 
//recreate another new model, and this new model will rely on the connection,
//that will make a huge mess, model's function might hang after the api call 