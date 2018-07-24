const dataCtrl = require('../controllers/stock.controller');
const authen = require('../controllers/authenticate.controller')();

module.exports = (app) => {
    let stockPrefix = '/api/stock';
    app.get(stockPrefix + '/*', /*authen,*/ dataCtrl.proxyDataService);
};
