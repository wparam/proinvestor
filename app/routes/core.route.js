const coreCtrl = require('../controllers/core.controller');
const authen = require('../controllers/authenticate.controller')();

module.exports = (app) => {
    app.get('/', authen, coreCtrl.index);
};
