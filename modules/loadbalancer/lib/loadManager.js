const LoadBalancer = require('./loadBalancer');
const logger = require('logger');
const cluster = require('cluster');

const _this = module.exports = {
    loaders: {},
    interval: 1000 * 15,
    addLoader: (groupId, server, statuspoint)=>{
        if(_this.loaders[groupId] === undefined){
            _this.loaders[groupId] = new LoadBalancer(groupId);
        }
        _this.loaders[groupId].addServer(server, statuspoint);
    },
    removeLoader: (loader)=>{   
        let idx = _this.loaders.indexOf(loader);
        if(idx >= 0){
            _this.loaders.splice(idx, 1);
        }
    },
    getServer: (groupId, uid)=>{
        let loader = _this.loaders[groupId];
        if(!loader){
            logger.error('Error in LoadManager: No loader for this group found');
            return;
        }
        return loader[groupId].getServer(uid);
    },
    run: ()=>{
        if(cluster.isMaster){//main process to run check, use workers
            let workers = cluster.workers;
            Object.keys(_this.loaders).forEach(groupId=>{
                if(_this.loaders[groupId]){
                    _this.loaders[groupId].startCheck().then(s=>{
                        for(const id in cluster.workers){
                            cluster.workers[id].send({groupId: groupId, servers: s});
                        }
                    });
                }
            });
            setTimeout(_this.run, _this.interval);
        }else{//other cluster process, recevie msg and update queue
            process.on('message', msg=>{
                if(msg.groupId && _this.loaders[msg.groupId]){
                    _this.loaders[msg.groupId].update(msg.servers);
                }
            });
        }
    },
    runByIPC:()=>{
        
    }
};