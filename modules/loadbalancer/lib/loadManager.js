module.exports = {
    loaders: {},
    addLoader: (groupId, host, endpoint)=>{
        
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