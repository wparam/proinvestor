const child_process = require('child_process');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const logger = require('logger');

const lbManager = require('../index');
const express = require('express'); //for test

//mock load configed balancers
lbManager.addLoader(1, 'http://localhost:20000', '/data/check');
lbManager.addLoader(1, 'http://localhost:20001', '/data/check');
lbManager.run();

const config = {port : 4000};

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
    let app = express();

    app.listen(config.port, () => {
        logger.info(`Server-Cluster: listening on ${config.port} from process: ${process.pid}`);
    });
}