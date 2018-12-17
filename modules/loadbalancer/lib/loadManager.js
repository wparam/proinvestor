module.exports = {
    loaders: [],
    addLoader: (loader)=>{
        if(!this.loaders.find(l=>l === loader)){
            this.loader.push(loader);
        }
    },
    removeLoader: (loader)=>{   
        let idx = this.loaders.indexOf(loader);
        if(idx >= 0){
            this.loaders.splice(idx, 1);
        }
    },
    dispatchLoader: ()=>{
        
    }
};