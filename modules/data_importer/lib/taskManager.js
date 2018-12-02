const fs       = require('fs');
const path     = require('path');
const logger   = require('logger');
const Importer = require('./importer');


module.exports = class ImportManager{
    constructor(mongoose, models) {
        this.mongoose = mongoose;
        this.models = models;
        this.constr = 'mongodb://localhost:27017/pro_investor';
        this.tasks = new Map(); 
        this.deps = new Map();
        this.depLinks = []; //array of names which has promises in deps, 
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
     * @param  {} taskname
     * @param  {} dependency
     */
    createTask(taskname, dependencies){
        if(!taskname || !this.importers[taskname]){
            logger.error(`This task is invalid: ${taskname}`);
            return;
        }
        //check depend task is in the list
        if(dependencies && dependencies.length>0){
            for(let i = 0, l = dependencies.length; i<l; i++){
                this.createDependency(dependencies[i]);
            }
        }
        let imp = {
            importer: new this.importers[taskname](this.models, this.isForceMode),
            dependencies: dependencies
        };
        if(!this.tasks.has(taskname))
            this.tasks.set(taskname, imp);
    }

    hasTask(taskname){
        if(!taskname){
            logger.error(`Fail in taskManager-hasTask: Invalid Task name: ${taskname}`);
            return;
        }
        return this.tasks.has(taskname);
    }

    createDependency(taskname){
        if(!this.importers[taskname]){
            logger.error(`Fail in createDependency: Task name is invalid: ${taskname}`);
            return;
        }
        //put into dep map first
        if(!this.deps.has(taskname)){
            this.deps.set(taskname, {
                importer: new this.importers[taskname](this.models, this.isForceMode)
            });
        }

        //then handle the depRunners array
        this.depTaskRunners.push
    
        if(this.hasTask(taskname)){
            this.cancelTask(taskname);
        }
    }

    createDepLinks(taskname){
        if(!this.depLinks || this.depLinks.length === 0){
            
        }
    }

    cancelTask(taskname){   
        if(!this.tasks.has(taskname))
            return false;
        return this.tasks.delete(taskname);
    }

    cancelDep(taskname){
        if(!this.deps.has(taskname))
            return false;
        return this.deps.delete(taskname);
    }
    
    runTasks(){
        if(this.tasks.size === 0){
            return Promise.reject(new Error('Tasks list is empty'));
        }

        return Promise.all(Array.from(this.deps.values()).map(dep=>dep.importer.import()))
                    .then(depResult=>Promise.all(Array.from(this.tasks.values()).map(task => task.importer.import())));
    }
    
}