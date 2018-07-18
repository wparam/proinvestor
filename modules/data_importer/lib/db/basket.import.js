const importer = require('../importer');
const mongoose = require('mongoose');
const fs       = require('fs');
const https    = require('https');
const zlib     = require('zlib');

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

    getNASDAQ100() {
        const requestOptions = {
            hostname: 'www.nasdaq.com',
            port: 443,
            path: '/quotes/nasdaq-100-stocks.aspx',
            method: 'GET',
            query: 'render=download',
            search: '?render=download',
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' : 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            }
        };
        let nasFile = fs.createWriteStream('nas.csv');
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

    getData() { 
        return Promise.resolve();
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
                
                return Promise.all(docs.map((doc)=>{
                    if(doc.name === 'NASDAQ-100'){
                        return self.getNASDAQ100()
                    }
                    return self.getData()
                })).then(((ds)=>{
                    console.log(ds);
                    resolve(ds);
                    self.afterImport();
                })).catch((err)=>{
                    reject(err);
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