const http   = require('http');
const logger = require('logger');
const util   = require('util');
const cluster = require('cluster');
/** Load Balancer Class */
class LoadBalancer{
    /**
     * @param  {string} The groupId used for each group, group can be org or other unit, one group match one loadbalancer
     */
    constructor(groupId){
        this.groupId = groupId; //
        this.servers = []; //[{server: 'xx.xx', statuspoint: '/xxx/xx, working: false}]
        this.curPool = new Map(); //{key: uid, value: server in this.servers[], it should be a server ip}
        // setInterval(()=>{
        //     this.debugFoo();
        // }, 1000 * 30);
    }
    debugFoo(){
        console.log(`*****Check Server in ${cluster.isMaster ? 'Master' : 'Cluster'}  ${process.pid}*****`);
        console.log(util.inspect(this.servers, {colors: true}));
    }
    getServer(uid){
        let workingservers = this.servers.filter(s=>s.working);
        if(workingservers.length===0){
            logger.error('LoadBalancer Error: No working servers now');
            return;
        }
        let s = this.curPool.get(uid);
        if(this.curPool.has(uid) && this.server[s] && this.servers[s].working){
            return s;
        }
        let news = workingservers[this.curPool.size % workingservers.length].server;
        this.curPool.set(uid, news);
        return news;
    }
    addServer(server, statuspoint){
        let findserver = this.servers.find(s=>s.server === server);
        if(!findserver){
            this.servers.push({server: server, statuspoint: statuspoint, working: false, lastchek: null});
        }else{
            logger.info(`LoadBalancer: Add exist server to list: ${server}`);
        }
    }
    removeServer(server){
        let idx = this.servers.findIndex(s=>s.server === server);
        if(idx !== -1)
            this.servers.splice(idx, 1);
    }
    startCheck(){
        //start check servers' status
        return this.isReady().then(s=>{
            logger.info('finish a round of check, the result is: ');
            logger.info(util.inspect(s, {colors: true}));
            return s;
        }).catch(e=>{
            logger.error(`Erorr caught in startCheck: ${e}`);
        });
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
                    logger.error(`Warning in isReady: Return statusCode: ${statusCode}`);
                    return resolve({server: s.server, status: false});
                }
                resolve({server: s.server, status: true});
            }).on('error', (e)=>{
                logger.error(`Error in isReady: ${e}`);
                resolve({server: s.server, status: false});
            });
        }));
        return Promise.all(sp).then(d=>{
            d.forEach(result=>{
                let s = this.servers.find(s=>s.server === result.server);
                s.working = result.status;
                s.lastchek = new Date();
            });
            return this.servers;
        });
    }
    update(servers){
        this.servers = servers;
    }
}

module.exports = LoadBalancer;