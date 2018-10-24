const dataCtrl = require('../controllers/stock.controller');
const authen = require('../controllers/authenticate.controller')();
const internalRouter =  require('../controllers/internal');

module.exports = (app) => {
    let stockPrefix = '/api/stock';
    // app.get(stockPrefix + '/*', authen,  dataCtrl.proxyDataService); //for backend load, can't auth now
    app.get(stockPrefix + '/*',  dataCtrl.proxyDataService);

    let internalPrefix = '/api/internal';
    app.use(internalPrefix, authen, internalRouter);
};
