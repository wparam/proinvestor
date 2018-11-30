const Importer = require('../importer');
const http = require('http');
const logger = require('logger');
const _  = require('lodash');

module.exports = class ChartImporter extends Importer{
    constructor(models, forceMode){
        super(models, forceMode);
        this._modelName = 'chart';
        this.model = this.models[this._modelName];
        this.api = '/api/stock/stock/market/batch?symbols={companies}&types=chart&range=5y';
        // this.api = '/api/stock/stock/market/batch?symbols={companies}&types=chart&range=5y';
        this.companyModel = this.models['company'];
    }
    static importerType(){
        return 'chart';
    }

    inImport(d) {
        if(d.clean)
            logger.info(`Clean up finished before import:${this._modelName}`);
        return new Promise((resolve, reject) => {
            this.companyModel.find({}, 'symbol', function(err, docs){
                if(err)
                    return reject(err);
                resolve(docs.map(n=>n.symbol));
            });
        })
        .then(this.getData.bind(this))
        .then(this.processData.bind(this))
        .then(this.insertData.bind(this));
    }

    //return array of promises
    getData(companies){
        if(!companies || companies.length === 0)
            return Promise.resolve([]);
        let cparr = this.compressCompany(companies);
        let promise = null;
        cparr = ['aapl,fb', 'tsla']
        return Promise.all(cparr.map((cp)=>{
            return new Promise((resolve, reject) => {
                let url = this.api.replace('{companies}', cp);
                let req = http.request({ hostname:'localhost', path: url, port:4000 }, (res)=>{
                    if(res.statusCode !== 200)
                        return reject(new Error(`Fail in getData when fetch company trade infor, company: ${company}`));
                    let s = '';
                    res.setEncoding = 'utf8';
                    res.on('data', (chunk)=>{
                        s += chunk;
                    });
                    res.on('end', ()=>{
                        let r = JSON.parse(s);
                        resolve(r);
                    });
                }).on('error', (err)=>{
                    reject(err);
                });
                req.end();
            });
        })).then((res)=>{
            let result = {};
            res.forEach((batch)=>{
                result = Object.assign(result, batch);
            });
            return result;
        });
    }

    compressCompany(companies){
        //since querystr max length roughly 2000 charactors, 
        let result = [],
            count = 300,//preset max length
            cursor = 0;
        while(cursor < companies.length){
            let temp = companies.slice(cursor, count);
            result.push(temp.join(',').replace(/,$/g, ''));
            cursor += count;
        }
        return result;
    }

    processData(data){
        return new Promise((resolve, reject)=>{
            if(!data || Object.keys(data).length === 0){
                logger.info('Chart importer: Done in insertData, no document need to be inserted');
                return resolve([]);
            }
            let d = [];
            Object.keys(data).forEach(key=>{    
                if(data[key] && data[key].chart && data[key].chart.length>0){
                    d = [].concat(d, data[key].chart.map((c)=>
                        Object.assign({
                            symbol: key,
                            datevalue: new Date(c.date).getTime()
                        }, c)
                    ));
                }
            });
            resolve(d);
        });
    }

    insertData(data){       
        // data sample: { apple: {chart: []}, fb: {chart: []}, tsla: {chart: []}}
        return new Promise((resolve, reject)=>{
            if(!data || data.length === 0){
                logger.info('Chart importer: Done in insertData, no document need to be inserted');
                return resolve(0);
            }
            this.model.insertMany(data, function(err, docs){
                if(err)
                    return reject(err);
                resolve(docs.length);
            });
        });
    }
}