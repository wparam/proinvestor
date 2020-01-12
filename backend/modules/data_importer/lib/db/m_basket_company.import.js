const Importer = require('../importer');
const fs       = require('fs');
const https    = require('https');
const zlib     = require('zlib');
const csv      = require('csv');
const readline = require('readline');
const logger   = require('logger');
const { Readable } = require('stream');

module.exports = class M_Basket_CompanyImporter extends Importer{
    constructor(models, forceMode){
        super(models, forceMode);
        this._modelName = 'm_basket_company';
        this.model = this.models[this._modelName];
        this.basketModel = this.models['basket']; //refer to basket model, dependency
    }
    static importerType(){
        return 'm_basket_company';
    }

    loadNASDAQ100(){
        let tempFileName = 'nas.csv';
        let nasFile = fs.createWriteStream(tempFileName);

        return this.getNASDAQ100(nasFile)
            .then(this.parseNASDAQ100.bind(this, tempFileName))
            .then((d)=>{
                return new Promise((resolve, reject)=>{
                    fs.unlink(tempFileName, (err)=>{ 
                        if(err) 
                            return reject(err);
                        resolve(d);
                    });  
                })
            })
            .then(this.insertNASDAQ100.bind(this));
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
                if(res.statusCode < 200 || res.statusCode>=400){
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
        let self = this;
        return new Promise((resolve, reject) => {
            if(!d || d.length===0)
                return reject(new Error('Fail in insertNASDAQ100: Empty document'));
            this.model.find({basket_name: "NASDAQ-100"}, function(err, docs){
                if(err){
                    return reject(err);
                }
                if(docs.length === 0){
                    self.model.insertMany(d, function(err, docs){
                        if(err){
                            return reject(err);
                        }
                        resolve(docs.length);
                    });
                }else if(docs.length!==d.length){
                    reject(new Error(`Fail in insertNASDAQ100: File has no.:${d.length}, and nas document in database has: ${docs.length}`));
                }else{
                    resolve(0);
                }
            });
        });
    }

    getData() { 
        return Promise.resolve();
    }

    inImport(d) {
        let self = this;
        if(d.clean)
            logger.info(`Clean up finished before import:${this._modelName}`);
        return new Promise((resolve, reject)=>{
            this.basketModel.find({}, function(err, docs){
                if(err)
                    return reject(err);
                return Promise.all(docs.map((doc)=>{
                    if(doc.name === 'NASDAQ-100'){
                        return self.loadNASDAQ100();
                    }
                    return self.getData();
                })).then((d)=>{
                    resolve(d);
                }).catch((err)=>{
                    reject(err);
                });
            });
        });
    }
    
    insertDocument(){}
}