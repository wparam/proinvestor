const glob = require('glob');
const path = require('path');

const modelsFiles = path.join(__dirname, '*.model1.js');

module.exports = (conn) => {
    const db = {};
    glob.sync(modelsFiles).forEach((file) => {
        var model = require(file)(conn);
        db[model.modelName] = model;
    });
    return db;
};