const import_log = require('./import_log');


module.exports = class Importer{
    constructor(models, forceMode=false){
        this._modelName = null;
        this.models = models;
        this._force = forceMode;
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    processData() {}

    saveData() {}

    import() {}

    beforeImport() {
        return new Promise((resolve, reject) => {
            if(this.model.db._readyState === 0){
                return reject(new Error('Current DB is closed'));
            }
            if(this._force){
                this.model.remove({}, function(err){
                    if(err)
                        return reject(err);
                    resolve(true);
                });
            }else
                resolve(1);
        });
        // console.log('start before import in importer father');
    }


    afterImport() {
        return new Promise((resolve, reject)=>{
            console.log(`Import finish on model: ${this._modelName}`);
            resolve();
        });
        // console.log('after before import in importer father');
    }
}   

