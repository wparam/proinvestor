const mongoose = require('mongoose');
const import_log = require('./import_log');


module.exports = class Importer{
    constructor(model){
        this.model = model;
    }

    processData() {}

    saveData() {}

    import() {}

    beforeImport() {
        // console.log('start before import in importer father');
    }

    afterImport() {
        // console.log('after before import in importer father');
    }
}   

