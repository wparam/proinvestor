const http = requier('http');
const logger = require('logger');

class LoadBalancer{
    constructor(groupId){
        this.groupId = groupId;
        this.servers = []; //[{server: 'xx.xx', statuspoint: '/xxx/xx, working: fasle}]
        this.curPool = new Map();
        this.interval = 1000 * 90;
        this.timeout = 1000 * 60 * 2;
    }
    getServer(uid){
        let workingservers = this.getWorkingServers();
        if(workingservers.length===0){
            logger.error('LoadBalancer Error: No working servers now');
            return;
        }
        let s = this.curPool.get(uid);
        if(this.curPool.has(uid) && this.checkServer(s)){
            return s;
        }
        let s = workingservers[this.curPool.size % workingservers.length].server;
        this.curPool.set(uid, s);
        return s;
    }
    addServer(server, statuspoint){
        let findserver = this.servers.find(s=>s.server === server);
        if(!findserver){
            servers.push({server: server, statuspoint: statuspoint, working: fasle, lastchek: null});
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
        //start check servers' status
        this.isReady().then(s=>{
            logger.info('finish a round of check, the result is: ');
            logger.info(this.servers);
        }).catch(e=>{
            logger.error(e);
        }).finally(()=>{
            //restart this check
            setTimeout(this.start(), this.interval);
        });
    }
    getWorkingServers(){
        return this.servers.filter(s=>s.working);
    }
    /**
     * async call to check the availability of the service
     */
    isReady(){
        const sp = this.servers.map(s=>new Promise((resolve, reject)=>{
            let checkUrl = s.server + s.statuspoint;
            return http.get(checkUrl, res=>{
                const {statusCode} = res;
                if(statusCode !== 200){
                    res.resume();
                    return resolve({server: s.server, status: false});
                }
                resolve({server: s.server, status: true});
                res.end();
            }).on('error', (e)=>{
                resolve({server: s.server, status: true});
            });
        }));
        return Promise.all(sp).then(d=>{
            d.forEach(result=>{
                let s = this.servers.find(s=>s.server === result.server);
                s.working = result.status;
                s.lastchek = new Date().getTime();
            });
        });
    }
}

module.exports = LoadBalancer;