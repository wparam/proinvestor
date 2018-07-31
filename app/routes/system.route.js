const authen = require('../controllers/authenticate.controller')();
const system = require('../controllers/system.controller');

module.exports = (app) => {
    app.get('/system/curload', authen, system.getCurrentLoad)
};
