const Importer = require('../importer');
const http = require('http');
const _  = require('lodash');

module.exports = class NewImporter extends Importer{
    constructor(models, forceMode){
        super(models, forceMode);
        this._modelName = 'new';
        this.model = this.models[this._modelName];
        this.api = '/api/stock/stock/{company}/news';
        this.companyModel = this.models['company'];
    }
    static importerType(){
        return 'new';
    }

    filterCompanyData(companies) {
        return new Promise((resolve, reject)=>{
            if(!companies || companies.length ===0){
                return reject(new Error('Fail in prepareCompanyData: Empty data got from mapping table'));
            }
            this.model.find({}, 'symbol', function(err, docs){
                if(err)
                    return reject(err);
                let result = companies.filter((c)=>{
                    return !docs.find((cc)=>{
                        return cc.symbol===c.symbol;
                    });
                });
                resolve(result);
            });
        });
    }

    getBatchData(batchCompanies){
        return new Promise((resolve, reject)=>{
            if(!batchCompanies || batchCompanies.length === 0)
                return resove('Batch load company list emtpy');
            Promise.all(batchCompanies.map((c)=>{ return this.getData(c.symbol); })).then((result)=>{
                resolve(result.reduce((accu, n)=>{ return [].concat(accu, n); }));
            });
        });
    }

    getData(company){
        return new Promise((resolve, reject) => {
            if(!company)
                return reject(new Error('Company is empty'));
            let url = this.api.replace('{company}', company);
            let req = http.request({ hostname:'localhost', path: url, port:4000 }, (res)=>{
                if(res.statusCode !== 200)
                    return reject(new Error(`Fail in getData when fetch company infor, company: ${company}`));
                let s = '';
                res.setEncoding = 'utf8';
                res.on('data', (chunk)=>{
                    s += chunk;
                });
                res.on('end', ()=>{
                    let r = JSON.parse(s);
                    if(r instanceof Array){
                        r.forEach((c)=>{
                            c.datevalue = new Date(c.date).getTime(),
                            c.symbol =  company
                        });
                        return resolve(r);
                    }
                    return reject(new Error('Fail in getData: '))
                });
            }).on('error', (err)=>{
                reject(err);
            });
            req.end();
        });
        
    }

    insertData(data){       
        return new Promise((resolve, reject)=>{
            let d = data instanceof Array ? data: [data];
            this.model.insertMany(d, function(err, docs){
                if(err)
                    return reject(err);
                resolve(docs.length);
            });
        });
        
    }

    inImport() {
        return new Promise((resolve, reject) => {
            this.companyModel.find({}, 'symbol', function(err, docs){
                resolve(docs);
            });
        })
        .then(this.filterCompanyData.bind(this))
        .then(this.getBatchData.bind(this))
        .then(this.insertData.bind(this));
    }

    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }
    }

    
}