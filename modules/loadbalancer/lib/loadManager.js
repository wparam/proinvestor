const LoadBalancer = require('./loadBalancer');

module.exports = {
    loaders: {},
    addLoader: (groupId, host, statuspoint)=>{
        if(this.loaders[groupId] === undefined){
            this.loaders[groupId] = new LoadBalancer(groupId, host, statuspoint);
        }else{

        }

    },
    removeLoader: (loader)=>{   
        let idx = this.loaders.indexOf(loader);
        if(idx >= 0){
            this.loaders.splice(idx, 1);
        }
    },
    dispatchLoader: ()=>{
        
    },
    run: ()=>{

    },
    checkAvailability: ()=>{
        
    }
};