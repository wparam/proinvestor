const dataCtrl = require('../controllers/data.controller');
const authen = require('../controllers/authen.controller')();

module.exports = (app) => {
    let prefix = '/api/data';
    app.get(prefix + '/*', authen, dataCtrl.proxyDataService);

    let stockPrefix = '/api/stock';
    app.get(prefix + '/*', authen, dataCtrl.proxyDataService);
};
