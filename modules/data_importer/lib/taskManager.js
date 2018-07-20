const fs       = require('fs');
const path     = require('path');
const Importer = require('./importer');


module.exports = class ImportManager{
    constructor(mongoose, models) {
        this.mongoose = mongoose;
        this.models = models;
        this.constr = 'mongodb://localhost:27017/asset_manager';
        this.tasks = new Map(); 
        this.conn = this.mongoose.connection;
        this.importers = ImportManager.getImporters();
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

//#region start connection related
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
        let self = this;
        return new Promise((resolve, reject) => {
            // this.conn.once('open', (err) => {
            //     console.log('DB connected');
            // });
            this.conn.on('error', (err) => {
                return reject(err);
            });
            if(this.isDbOpen)
                return resolve('DB is already connected');
            else
                this.mongoose.connect(this.constr, {useNewUrlParser: true}).then(function(){
                    return resolve('DB is connected');
                });
        });
    }

    closeConnection() {
        return new Promise((resolve, reject) => {
            if(!this.isDbClosed){
                this.mongoose.disconnect();        
            }
            resolve('Db is closed');
        });
    }
//#endregion
    
    createTask(taskName, dependency){
        if(!taskName || this.importers.indexOf(taskName)<0)
            return new Error('Task name is invalid');
        let dep = [];
        if(dependency.length>0){
            for(let i = 0, l = dependency.length; i<l; i++){
                if(this.importers.indexOf(dependency[i])>=0)
                    dep.push(new this.importers[dependency[i]](this.models));
                else
                    return new Error('Dependency is invalid');
            }
        }
        let imp = {
            dependency: dep,
            importer: new this.importers[taskName](this.models)
        };
        if(!this.tasks.has(taskName))
            this.tasks.set(taskName, imp);
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
        return Promise.all((Array.from(this.tasks.values()).map((importer) => {
            if(importer.dependency.length>0){
                let depPromise = importer.dependency[0].import();
                for(let i = 1, l = importer.dependency.length; i<l; i++){
                    depPromise = importer.dependency[i].import();
                }
            }
            return true;//importer.import();
        })));
    }
    
}