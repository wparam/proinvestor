const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const models = require('../app/models')(mongoose.connection);
const logger = require('logger');

mongoose.Promise = global.Promise;

var conn = mongoose.connection;

const openConnection = ()=>{
    return new Promise((resolve, reject) => {
        if(conn.readyState === 0){
            conn = mongoose.connect('mongodb://localhost/asset_manager', {useMongoClient: true});
        }

        conn.on('open', () => {
            resolve('DB is open');
        });
        
        conn.on('error', (err) => {
            reject(err);
        });
    });
    
}

const closeConnection = ()=>{
    return new Promise((resolve, reject) => {
        if(conn.readyState === 1){
            mongoose.disconnect();        
        }
        resolve('Db is closed');
    });
    
}

const removeDocuments = (modelName, db, done) => {
    if(!modelName)
        return;
    if(typeof db === 'function'){
        done = db;
        db = conn;
    }
    const model = db.model(modelName);
    model.deleteMany({}, function(err){
        if(err){
            return done(err);            
        }
        done(null, true);
    });
}

const loadDocuments = (db,  done) => {
    if(typeof db === 'function'){
        done = db;
        db = conn;
    }
    const dataFolder = path.join(__dirname, 'data');
    return fs.readdir(dataFolder, (err, files)=>{
        if(err)
            return done(err);
        let docs = [];
        files.forEach((file)=>{
            let filename = path.join(__dirname, 'data', file);
            let f = file.split('.')[0];
            removeDocuments(f, db, (err, flag)=>{
                if(err||!flag){
                    return done(err);
                }
                fs.readFile(filename, 'utf8', (err, data) => {
                    if(err)
                        return done(err);
                    insertDocuments(f, data, db, (err, doc) => {
                        docs.push(doc);
                        if(docs.length === files.length){
                            return done(null, docs);
                        }
                    });
                });
            });
        });
    });
};

const insertDocuments = (modelName, data, db, done) => {
    if(!modelName || (data instanceof Array && data.length === 0)){
        return done(`Error in insertDocuments, modelName:${modelName}, data.length:${data.length}`);
    }
    if(typeof db === 'function'){
        done = db;
        db = conn;
    }
    const model = models[modelName];
    model.insertMany(JSON.parse(data), function(err, doc){
        if(err){
            return done(err);            
        }
        done(null, doc);
    });
};

//mixed by promise and callback, really bad idea
const loadData = (db, done)=>{
    openConnection().then( (msg)=>{
        logger.info(msg);
        if(typeof db === 'function'){
            done = db;
            db = conn;
        }
        return loadDocuments(db, (err, docs) => {
            logger.info(`Insert docs number:${docs.length}`);
            return closeConnection().then((msg)=>{
                return done(null, msg);
            }).catch((err)=>{
                return done(err);
            });
        });
    } ).catch( (err) => {
        logger.error(err);
    });
    
}

module.exports = {
    loadData: loadData,
}