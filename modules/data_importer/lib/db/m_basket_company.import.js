const importer = require('../importer');
const fs       = require('fs');
const https    = require('https');
const zlib     = require('zlib');
const csv      = require('csv');
const readline = require('readline');
const { Readable } = require('stream');

module.exports = class M_Basket_CompanyImporter extends importer{
    constructor(model){
        super(model);
        this._modelName = 'm_basket_company';
    }
    static importerType(){
        return 'm_basket_company';
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    loadNASDAQ100(){
        let tempFileName = 'nas.csv';
        let nasFile = fs.createWriteStream(tempFileName);

        return this.getNASDAQ100(nasFile)
            .then(this.parseNASDAQ100.bind(this, tempFileName))
            .then((data)=>{
                console.log('hit finish parse');
                console.log(data);
            })
            .then(()=>{
                fs.unlink(tempFileName, (err)=>{ 
                    if(err) 
                        return Promise.reject(err);
                    return Promise.resolve();
                });        
            });
        
    }

    getNASDAQ100(targetStream) {
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

                let filestream = rs.pipe(targetStream);
                filestream.on('finish', ()=>{
                    resolve();
                });
                filestream.on('error', (err)=>{
                    reject(err);
                });
            }).on('error', (err)=>{
                reject(err);
            });
            req.end();
        });
    }

    parseNASDAQ100(sourceStream){
        const basketName = 'NASDAQ-100';
        return new Promise((resolve, reject)=>{
            let linereader = readline.createInterface({
                input: fs.createReadStream(sourceStream)
            });
            let nasArry = [];
            linereader.on('line', (line)=>{
                let s = line.split(',');
                if(s[0] === 'Symbol')
                    return;
                nasArry.push({
                    basket_name: basketName,
                    company_symbol: s[0].trim(),
                    company_name: s[1].trim(),
                    last_sale: parseFloat(s[2]),
                    net_change: parseFloat(s[3]),
                    pct_change: parseFloat(s[4]),
                    share_volume: parseFloat(s[5]),
                    points: parseFloat(s[6])
                });
            });
            linereader.on('close', ()=>{
                resolve(nasArry);
            });
        });
    }

    insertNASDAQ100(d){
        return new Promise((resolve, reject) => {
            // this.model.
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
            this.model.find({}, function(err, docs){
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
}