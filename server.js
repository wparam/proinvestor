const child_process = require('child_process');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const logger = require('logger');
const config = require('./config');
const lbManager = require('loadbalancer');

//mock load configed balancers
lbManager.addLoader('http://localhost:20000', '/data');
lbManager.addLoader('http://localhost:20001', '/data');
lbManager.run();

if(cluster.isMaster){
    let workers = [];
    logger.info(`Server-Master: Start spawning clusters`);
    for(let i = 0; i<cpus; i++){
        workers.push(cluster.fork());
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.info(`Server: worker ${worker.process.pid} is out`);
    });
}
else{
    let app = require('./app')();

    app.listen(config.port, () => {
        logger.info(`Server-Cluster: listening on ${config.port} from process: ${process.pid}`);
    });
}