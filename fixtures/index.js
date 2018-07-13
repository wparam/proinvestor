const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const models = require('../app/models')();
mongoose.Promise = global.Promise;
var conn = mongoose.connection;

if(conn.readyState === 0){
    conn = mongoose.connect('mongodb://localhost/asset_manager', {useMongoClient: true});
}

conn.on('error', (err) => {
    console.error(err);
});

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
                    insertDocuments(f, data, db, done);
                });
                
            });
        });
        done(null, files);
    });
};

const insertDocuments = (modelName, data, db, done) => {
    if(!modelName || (data instanceof Array && data.length === 0))
        return;
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

const loadData = (db, done)=>{
    if(typeof db === 'function'){
        done = db;
        db = conn;
    }
    if(conn.readyState === 0)
        return done('db is not open');
    return loadDocuments(db, done);
}

module.exports = {
    loadData: loadData,
}