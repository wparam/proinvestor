module.exports = (mongoose) => {
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
    
    return mongoose.model('import_log', log);
};

