const mongoose = require('mongoose');

 const log = mongoose.Schema({
    stamp:{
        type: String,
        required: true,
    },
    table: String,
    flag: Boolean
}, 
{ timestamp: {} });

log.index({stamp: 1, table: 1}, {unique: true});

module.exports = mongoose.model('import_log', log);

