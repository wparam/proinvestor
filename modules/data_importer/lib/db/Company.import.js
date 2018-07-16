const importer = require('../importer');
const mongoose = require('mongoose');

module.exports = class CompanyImporter extends importer{
    constructor(conn){
        super(conn);
        this.modelName = 'Company';
        this.model = mongoose.model(this.modelName);
    }
    getRemoteData() {
        
    }
    import() {

    }

    
}