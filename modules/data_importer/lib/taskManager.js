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
        this.force = false;
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

    get isForceMode(){
        return this.force;
    }

    set setForceMode(v){
        this.force = v;
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

    /**
     * tasks looks like this: 
     * new Map({
     *   'name': {importer: new importer(), dependency: [ new importer(), new importer(), ... ]
     * })
     * @param  {} taskName
     * @param  {} dependency
     */
    createTask(taskName, dependency){
        if(!taskName || !this.importers[taskName])
            return new Error('Task name is invalid');
        let dep = [];
        if(dependency && dependency.length>0){
            for(let i = 0, l = dependency.length; i<l; i++){
                if(this.importers[dependency[i]])
                    dep.push(new this.importers[dependency[i]](this.models, this.isForceMode));
                else
                    return new Error('Dependency is invalid');
            }
        }
        let imp = {
            dependency: dep,
            importer: new this.importers[taskName](this.models, this.isForceMode)
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
        return Promise.all((Array.from(this.tasks.values()).map((task) => {
            let dep = null;
            if(task.dependency.length>0){
                dep = task.dependency[0].import();
                for(let i = 1, l = task.dependency.length-1; i<l; i++){
                    dep = dep.then(task.dependency[i].import.bind(task.dependency[i]));
                }
            }
            return dep === null ? task.importer.import() : dep.then(task.importer.import.bind(task.importer));
        })));
    }
    
}