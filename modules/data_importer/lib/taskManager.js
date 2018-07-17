const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');


module.exports = class ImportManager{
    constructor() {
        this.constr = 'mongodb://localhost:27017/asset_manager';
        this.tasks = new Map(); 
        this.conn = mongoose.connection;
    }

    static getImporters(){
        var importers = {};
        const importerFolder = path.join(__dirname, 'db');
        const files = fs.readdirSync(importerFolder);
        files.forEach( (file) => {
            let cls = require(path.join(__dirname, 'db', file));
            importers[cls.importerType()] = cls;
        });

        return importers;
    }

    get isDbOpen(){
        return this.conn.readyState === 1;
    }
    get isDbClosed(){
        return this.conn.readyState === 0;
    }

    getConnection(){
        return this.conn;
    }

    openConnection() {
        return new Promise((resolve, reject) => {
            this.conn.once('open', (err) => {
                console.log('DB connected');
            });
            this.conn.on('error', (err) => {
                return reject(err);
            });
            if(this.isDbOpen)
                return resolve(this.conn);
            else
                mongoose.connect(this.constr, {useNewUrlParser: true}).then(function(){
                    return resolve(this.conn);
                });
        });
    }

    closeConnection() {
        return new Promise((resolve, reject) => {
            if(!this.isDbClosed){
                mongoose.disconnect();        
            }
            resolve('Db is closed');
        });
    }
    
    createTask(taskName, importer){
        if(!this.tasks.has(taskName))
            this.tasks.set(taskName, importer);
    }

    cancelTask(taskName){   
        if(!this.tasks.has(taskName))
            return false;
        return this.tasks.delete(taskName);
    }
    
    runTasks(){
        if(this.tasks.size === 0){
            return Promise.reject(new Error('Tasks list is empty'));
        }
        return this.tasks.get('basket').import().catch((err)=>{console.log(err.stack);});
        // return Promise.all((Array.from(this.tasks.values()).map((importer) => {
        //     return importer.import();
        // })));
    }
    
}