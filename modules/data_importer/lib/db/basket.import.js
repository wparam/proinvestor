const importer = require('../importer');
const mongoose = require('mongoose');

module.exports = class BasketImporter extends importer{
    constructor(model){
        super(model);
        this._modelName = 'basket';
    }
    static importerType(){
        return 'basket';
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    getRemoteData() {
        
    }

    import() {
        let self = this;
        return new Promise((resolve, reject)=>{
            this.beforeImport();
            //note: callback in mongoose"s api can"t use array function
            this.model.find({}, null, function(err, docs){
                if(err)
                    return reject(err);
                console.log(docs);
                self.afterImport();                
                resolve(docs);
            });
        });
        
    }
    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }

    }

    
}