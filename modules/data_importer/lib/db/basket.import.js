const importer = require('../importer');
const fs       = require('fs');
const https    = require('https');
const zlib     = require('zlib');
const csv      = require('csv');

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

    loadNASDAQ100(){
        return this.getNASDAQ100().then(this.parseNASDAQ100.bind(this));
    }

    getNASDAQ100() {
        const requestOptions = {
            hostname: 'www.nasdaq.com',
            port: 443,
            path: '/quotes/nasdaq-100-stocks.aspx?render=download',
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language' : 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        let tempFileName = 'nas.csv';
        let nasFile = fs.createWriteStream(tempFileName);
        return new Promise((resolve, reject) => {
            const req = https.request(requestOptions, (res)=> {
                const {statusCode} = res;
                const contentEncoding = res.headers['content-encoding']
                let rs = res;
                if(statusCode!==200){
                    res.resume();
                    reject(Error(`Request Failed: StatusCode: ${statusCode} `));
                }

                if(contentEncoding === 'gzip'){
                    rs = res.pipe(zlib.createGunzip());
                }else if(contentEncoding === 'deflate'){
                    rs = res.pipe(zlib.createInflate());
                }

                let filestream = rs.pipe(nasFile);
                filestream.on('finish', ()=>{
                    fs.readFile(tempFileName, 'utf8', (err, data)=>{
                        fs.unlink(tempFileName, (e)=>{ 
                            if(e || err) 
                                return reject(e || err);
                            resolve(data);
                        });
                    });
                });
                filestream.on('error', (err)=>{
                    fs.rmdir(nasFile, (err)=>{ if(err) reject(err); });
                });
            }).on('error', (err)=>{
                reject(err);
            });
            req.end();
        });
    }

    parseNASDAQ100(data){
        return new Promise((resolve, reject)=>{
            csv.parse(data, (err, d)=>{
                console.log(d);
                resolve();
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
            if(this.model.db._readyState === 0){
                return reject(new Error('Current DB is closed'));
            }
            //note: callback in mongoose"s api can"t use array function
            this.model.find({name: 'NASDAQ-100'}, function(err, docs){
                if(err)
                    return reject(err);
                if(docs.length===0)
                    resolve([]);
                return Promise.all(docs.map((doc)=>{
                    if(doc.name === 'NASDAQ-100'){
                        return self.loadNASDAQ100()
                    }
                    return self.getData();
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