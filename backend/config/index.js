const path  = require('path');
const _ = require('underscore');
const logger = require('./lib/logger');
const fs = require('fs');
const yaml = require('js-yaml');
const glob = require('glob');

var extConfig = {};
if (process.env.NODE_CONFIG !== null && process.env.NODE_CONFIG !== undefined) {
    try {
        extConfig = yaml.safeLoad(fs.readFileSync(process.env.NODE_CONFIG, 'utf8'));
        logger.info('External config file found at: ' + process.env.NODE_CONFIG);
    } catch (e) {
        logger.error(e);
    }
}

const self = module.exports = _.extend( require('./env/all'), require(`./env/${process.env.NODE_ENV}`) || {}, extConfig );

module.exports.getGlobbedFiles = (globPatterns, removeRoot)=>{
    // For context switching
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(globPattern=>{
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            glob(globPatterns, {
                sync: true
            }, (err, files)=>{
                if (removeRoot) {
                    files = files.map(file=>file.replace(removeRoot, ''));
                }
                output = _.union(output, files);
            });
        }
    }

    return output;
};

module.exports.getJavaScriptAssets = ()=>{
    if(!self.assets.lib.js || self.assets.lib.js.length===0)
        return '';
    let output = [];
    self.assets.lib.js.forEach(jfiles=>{
        let files = glob.sync(path.join(path.dirname(require.main.filename), jfiles)).map(file=>{
            return file.substr(file.lastIndexOf("/"));
        });
        output =  [...output, ...files];
    });
    return output;
};

module.exports.getCssAssets = ()=> {
    if(!self.assets.lib.css || self.assets.lib.css.length===0)
        return '';
    let output = [];
    self.assets.lib.css.forEach(cfiles=>{
        let files = glob.sync(path.join(path.dirname(require.main.filename), cfiles)).map(file=>{
            return file.substr(file.lastIndexOf("/"));
        });
        output =  [...output, ...files];
    });
    return output;
};