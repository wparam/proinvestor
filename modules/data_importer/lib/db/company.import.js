const Importer = require('../importer');
const http = require('http');

module.exports = class CompanyImporter extends Importer{
    constructor(models, forceMode){
        super(models, forceMode);
        this._modelName = 'company';
        this.model = this.models[this._modelName];
        this.api = '/api/stock/stock/{company}/company';
        this.mapModel = this.models['m_basket_company'];
    }
    static importerType(){
        return 'company';
    }

    filterCompanyData(mapCompanys) {
        return new Promise((resolve, reject)=>{
            if(!mapCompanys || mapCompanys.length ===0){
                return reject(new Error('Fail in prepareCompanyData: Empty data got from mapping table'));
            }
            this.model.find({}, 'symbol', function(err, docs){
                if(err)
                    return reject(err);
                let result = mapCompanys.filter((mc)=>{
                    return !docs.find((c)=>{
                        return c.symbol===mc;
                    });
                });
                resolve(result);
            });
        });
    }

    getBatchData(batchCompanies){
        return new Promise((resolve, reject)=>{
            if(!batchCompanies || batchCompanies.length === 0)
                return reject(new Error('Fail in getBatchData: Batch load company list emtpy'));
            Promise.all(batchCompanies.map((c)=>{ return this.getData(c); })).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                console.error(err.message);
            });
        });
    }

    getData(company){
        return new Promise((resolve, reject) => {
            if(!company)
                return reject(new Error('Company is empty'));
            let url = this.api.replace('{company}', company);
            let req = http.request({ hostname:'localhost', path: url, port:4000 }, (res)=>{
                if(res.statusCode < 200 || res.statusCode>=400)
                    return reject(new Error(`Fail in getData when fetch company infor, company: ${company}, status Code: ${res.statusCode}`));
                let s = '';
                res.setEncoding = 'utf8';
                res.on('data', (chunk)=>{
                    s += chunk;
                });
                res.on('end', ()=>{
                    resolve(JSON.parse(s));
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

    import() {
        return this.beforeImport().then((d)=>{
            return new Promise((resolve, reject) => {
                this.mapModel.distinct('company_symbol', function(err, docs){
                    resolve(docs);
                });
            });
        })
        .then(this.filterCompanyData.bind(this))
        .then(this.getBatchData.bind(this))
        .then(this.insertData.bind(this))
        .then((d)=>{ console.log('after import'); console.log(d);  })
        .catch((err)=>{
            console.log(err.stack);
        }).then(this.afterImport.bind(this));
    }

    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }
    }

    
}