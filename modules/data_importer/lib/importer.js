const import_log = require('./import_log');
const logger     = require('logger');

module.exports = class Importer{
    constructor(models, forceMode=false){
        this._modelName = null;
        this.models = models;
        this._forceMode = forceMode;
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    get forceMode(){
        return this._forceMode;
    }

    set forceMode(v){
        this._forceMode = v;
    }

    processData() {}

    saveData() {}

    import() {
        return this.beforeImport()
            .then(this.inImport.bind(this))
            .catch((err)=>{ 
                logger.error(err);
                return -1;
            })
            .then(this.afterImport.bind(this));
    }

    beforeImport() {
        return new Promise((resolve, reject) => {            
            if(this.model.db._readyState === 0){
                return reject(new Error('Current DB is closed'));
            }
            logger.info(`Import started on model: ${this._modelName}`);
            if(this._force){
                this.model.remove({}, function(err){
                    if(err)
                        return reject(err);
                    resolve({clean: true});
                });
            }else
                resolve({clean: false});
        });
    }

    inImport() {}

    afterImport(docAffected) {
        return new Promise((resolve, reject)=>{            
            if(docAffected!==-1){
                logger.info(`Import finished on model: ${this._modelName}, affected documents: ${docAffected}`);
                resolve();
            }else
                reject(-1);
        });
    }
}   

