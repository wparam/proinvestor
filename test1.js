const child_process = require('child_process');
const cluster = require('cluster');
const cpus = require('os').cpus().length;

if(cluster.isMaster){
    
    console.log(`master ${process.pid} is running`);
    let workers = [];
    for(let i = 0; i<cpus; i++){
        workers.push(cluster.fork());
    }
    console.log('hit');
    console.log(workers.length);
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
    for(let i = 0; i<workers.length; i++){
        // workers[i].on('message', (msg) => {
            // console.log(`receive message, and it is ${msg.test}`);
        // });
        workers[i].send({test: 'This is msg from master'});
    }
}
else{
    console.log(`Worker ${process.pid} started`);
    process.on('message', (msg) => {
        console.log(`receive message, the msg is : ${msg.test}`);
    });
    // process.send({test: 'This is msg from cluster'});
}