const coreCtrl = require('../controllers/core.controller');
const authen = require('../controllers/authen.controller')();

module.exports = (app) => {
    app.get('/test', authen, function(req, res){
        res.send('<div>test</div>');
    });
};
