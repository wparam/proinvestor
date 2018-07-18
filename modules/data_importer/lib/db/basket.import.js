const importer = require('../importer');
const mongoose = require('mongoose');
const https     = require('https');

module.exports = class BasketImporter extends importer{
    constructor(model){
        super(model);
        this._modelName = 'basket';
    }
    static importerType(){
        return 'basket';
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    getRemoteData(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res)=> {
                const {statusCode} = res;
                const contentType = res.headers['content-type'];
                const contentDisposition = res.headers['content-disposition'];

                let error;  
                if(statusCode!==200){
                    error = new Error(`Request Failed: StatusCode: ${statusCode} `);
                }

                if(error){
                    res.resume();
                    return reject(error);
                }

                res.setEncoding('utf8');
                let rawData = '';

                res.on('data', (chunk)=>{
                    rawData += chunk;
                });

                res.on('end', ()=>{
                    const parsedData = JSON.parse(rawData);
                    console.log(parsedData);
                    resolve(parsedData);
                });
            }).on('error', (err)=>{
                console.log('err in errr');
                console.log(err.stack);
                reject(err.message);
            });
        });
        
    }

    import() {
        let self = this;
        return new Promise((resolve, reject)=>{
            this.beforeImport();
            //note: callback in mongoose"s api can"t use array function
            this.model.find({}, null, function(err, docs){
                if(err)
                    return reject(err);
                if(docs.length===0)
                    resolve([]);
                docs.forEach((doc) => {
                    console.log(doc);
                    self.getRemoteData(doc.componentUrl).then((d)=>{
                        console.log(d);
                        self.afterImport();                
                        resolve(docs);
                    }).catch((err)=>{
                        console.log(err);
                        reject(err);
                    });
                });
                
            });
        });
        
    }
    insertDocument(){}

    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }

    }

    
}