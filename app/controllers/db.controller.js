const logger = require('logger');

module.exports = {
    getDBStorage: (mongoose, req, res, next)=>{
        if(!mongoose){
            logger.error('Fail in getDBStorage: Mongoose is empty');
            return;
        }
        res.json(mongoose.connection.collections);
    }
};