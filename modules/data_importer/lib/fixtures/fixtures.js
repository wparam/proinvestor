const path = require('path');
const fs   = require('fs');
const glob = require('glob');
const fixtures = path.resolve(__dirname, './*.json');

//TODO
module.exports = {
    loadFixtures: (modelName) => {
        return new Promise((resolve, reject) => {
            glob(fixtures, (err, matches)=>{

            });
        });
    }
};