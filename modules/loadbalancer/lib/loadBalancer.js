const http = requier('http');
const logger = require('logger');

class LoadBalancer{
    constructor(groupId){
        this.groupId = groupId;
        this.servers = {};
        this.curPool = new Map();
    }
    getServer(uid){
        let s = this.curPool.get(uid);
        if(this.curPool.has(uid) && this.checkServer(s)){
            return s;
        }
    }
    addServer(server, statuspoint){
        if(servers[server]===undefined){
            servers[server] = { statuspoint: statuspoint, working: fasle};
        }else{
            logger.info(`LoadBalancer: Add exist server to list: ${server}`);
        }
    }
    removeServer(server){
        if(servers[server])
            delete servers[server];
    }
    checkServer(serverId){
        return this.server[serverId] && this.servers[serverId].working;
    }
    start(){
        
    }
    /**
     * async call to check the availability of the service
     */
    isReady(){
        const checkUrl = this.host + this.statuspoint + this.check;
        return new Promise((resolve, reject)=>{
            http.get(checkUrl, res=>{
                const {statusCode} = res;
                if(statusCode !== 200){
                    res.resume();
                    return reject(new Error(`Check Failed on Url: ${checkUrl}`));
                }
                resolve(true);
                res.end();
            }).on('error', (e)=>{
                reject(e);
            });
        });
    }
    

}

module.exports = LoadBalancer;