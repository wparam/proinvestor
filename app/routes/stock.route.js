const dataCtrl = require('../controllers/stock.controller');
const authen = require('../controllers/authenticate.controller')();
const internalCtrl = require('../controllers/internal.controller');

module.exports = (app) => {
    let stockPrefix = '/api/stock';
    // app.get(stockPrefix + '/*', authen,  dataCtrl.proxyDataService); //for backend load, can't auth now
    app.get(stockPrefix + '/*',  dataCtrl.proxyDataService);

    let internalPrefix = '/api/internal';
    app.get(internalPrefix + '/*', authen, internalCtrl.foo);
};
