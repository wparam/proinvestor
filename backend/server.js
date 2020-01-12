const cluster = require('cluster');
const cpus = require('os').cpus().length;
const logger = require('./config/lib/logger');
const app = require('./config/lib/app');

if(process.env.NODE_ENV==='development'){
    app.start();
    return;
}

if (cluster.isMaster) {
    let workers = [];
    logger.info(`Server-Master: Start spawning clusters`);
    for (let i = 0; i < cpus - 1; i++) {
        workers.push(cluster.fork());
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.info(`Server: worker ${worker.process.pid} is out, code is ${code}`);
    });
}
else {
    app.start();
}