const importer = require('../importer');

module.exports = class CompanyImporter extends importer{
    constructor(conn){
        super(conn);
        this._modelName = 'company';
        this.model = mongoose.model(this._modelName);
    }
    static importerType(){
        return 'company';
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    getRemoteData() {
        
    }

    import(entity) {
        if(!entity || !entity.symbol){
            throw new Error('Fail at Company import, entity is invalid');
        }
        //note: callback in mongoose"s api can"t use array function
        this.model.findOne({ symbol: entity.symbol }, function(err, company){
            console.log(err);
            console.log(company);
        });
    }
    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }

    }

    
}