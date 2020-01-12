const db = require('../..//models');
const errorHandler = require('../error.controller');

exports.companyList = (req, res, next) => {
    db.company.find({}, function(err, docs){
        if(err)
            return errorHandler.error500(res, 'Error: When finding company list');
        res.json(docs);
    });
};