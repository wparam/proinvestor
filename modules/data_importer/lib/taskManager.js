const fs       = require('fs');
const path     = require('path');
const logger   = require('logger');
const Importer = require('./importer');


module.exports = class ImportManager{
    constructor(mongoose, models) {
        this.mongoose = mongoose;
        this.models = models;
        this.constr = 'mongodb://localhost:27017/asset_manager';
        this.tasks = new Map(); 
        this.deps = new Map();
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
        if(!taskName || !this.importers[taskName]){
            logger.error(`This task is invalid: ${taskName}`);
            return;
        }
        //check depend task is in the list
        if(dependency && dependency.length>0){
            for(let i = 0, l = dependency.length; i<l; i++){
                this.createDependency(dependency[i]);
            }
        }
        let imp = {
            importer: new this.importers[taskName](this.models, this.isForceMode)
        };
        if(!this.tasks.has(taskName))
            this.tasks.set(taskName, imp);
    }

    hasTask(taskName){
        if(!taskName){
            logger.error(`Fail in taskManager-hasTask: Invalid Task name: ${taskName}`);
            return;
        }
        return this.task.has(taskName);
    }

    createDependency(taskName){
        if(!this.importers[taskName]){
            logger.error(`Fail in createDependency: Task name is invalid: ${taskName}`);
            return;
        }
        if(this.hasTask(taskName)){
            this.cancelTask(taskName);
        }
        if(!this.deps.has(taskName))
            this.deps.set(taskName, {
                importer: new this.importers[taskName](this.models, this.isForceMode)
            });
    }

    cancelTask(taskName){   
        if(!this.tasks.has(taskName))
            return false;
        return this.tasks.delete(taskName);
    }

    cancelDep(taskName){
        if(!this.deps.has(taskName))
            return false;
        return this.deps.delete(taskName);
    }
    
    runTasks(){
        if(this.tasks.size === 0){
            return Promise.reject(new Error('Tasks list is empty'));
        }

        return Promise.all(Array.from(this.deps.values()).map(dep=>dep.importer.import()))
                    .Promise.all(Array.from(this.tasks.values()).map(task => task.importer.import()));
    }
    
}