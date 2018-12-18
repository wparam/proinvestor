const http = requier('http');

class LoadBalancer{
    constructor(host, endpoint, check='/check'){
        this.host = host;
        this.endpoint = endpoint;
        this.check = check;
        this.connections = new Map();
    }

    start(){
        
    }
    /**
     * async call to check the availability of the service
     */
    isReady(){
        const checkUrl = this.host + this.endpoint + this.check;
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

module.exports = LoadWorker;