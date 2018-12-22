const http = requier('http');
const logger = require('logger');

class LoadBalancer{
    constructor(groupId){
        this.groupId = groupId;
        this.servers = []; //[{server: 'xx.xx', statuspoint: '/xxx/xx, working: fasle}]
        this.curPool = new Map();
    }
    getServer(uid){
        let s = this.curPool.get(uid);
        if(this.curPool.has(uid) && this.checkServer(s)){
            return s;
        }
    }
    addServer(server, statuspoint){
        let findserver = this.servers.find(s=>s.server === server);
        if(!findserver){
            servers.push({server: server, statuspoint: statuspoint, working: fasle});
        }else{
            logger.info(`LoadBalancer: Add exist server to list: ${server}`);
        }
    }
    removeServer(server){
        let idx = this.servers.findIndex(s=>s.server === server);
        if(idx !== -1)
            this.servers.splice(idx, 1);
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