const Importer = require('../importer');
const logger = require('logger');
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

    import() {
        return this.beforeImport().then((d)=>{
            if(d.clean)
                logger.info(`Clean up finished before import:${this._modelName}`);
            return new Promise((resolve, reject) => {
                this.mapModel.distinct('company_symbol', function(err, docs){
                    resolve(docs);
                });
            });
        })
        .then(this.filterCompanyData.bind(this))
        .then(this.getBatchData.bind(this))
        .then(this.insertData.bind(this))
        .catch((err)=>{
            console.log(err.stack);
        }).then(this.afterImport.bind(this));
    }

    /**
     * Filter the document from map table, find those companies are in map table but does't exist in company table yet
     * @param  {document} mapCompanys is from map_basket_company table's document
     */
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
            if(!batchCompanies || batchCompanies.length === 0){
                logger.info('Company importer: Done in getBatchData, there is no companies need to be inserted');
                return resolve([]);
            }
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
            if(!data || (data instanceof Array && data.length === 0)){
                logger.info('Company importer: Done in insertData, no document need to be inserted');
                return resolve(0);
            }
            let d = data instanceof Array ? data: [data];
            this.model.insertMany(d, function(err, docs){
                if(err)
                    return reject(err);
                resolve(docs.length);
            });
        });
        
    }

    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }
    }

    
}