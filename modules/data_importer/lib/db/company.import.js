const Importer = require('../importer');
const https = require('https');

module.exports = class CompanyImporter extends Importer{
    constructor(models, forceMode){
        super(models, forceMode);
        this._modelName = 'company';
        this.model = this.models[this._modelName];
        this.api = '/stock/{company}/company';
        this.mapModel = this.models['m_basket_company'];
    }
    static importerType(){
        return 'company';
    }

    get modelName(){
        return this._modelName;
    }

    set modelName(v){
        this._modelName = v;
    }

    getRemoteData() {
        
    }

    getData(company){
        return new Promise((resolve, reject) => {
            if(!company)
                return reject(new Error('Company is empty'));
            let url = this.api.replace('{company}', company);
            https.get(url, (res)=>{
                if(res.statusCode !== 200)
                    return reject(new Error(`Fail in getData when fetch company infor, company: ${company}`));
                let s = '';
                res.setEncoding = 'utf8';
                res.on('data', (chunk)=>{
                    s += chunk;
                });
                res.on('end', ()=>{
                    console.log(s);
                    resolve(JSON.parse(s));
                });
            }).on('error', (err)=>{
                reject(err);
            });
        });
        
    }

    import() {
        return this.beforeImport().then((d)=>{
            return new Promise((resolve, reject) => {
                this.mapModel.distinct('company_symbol', {}, function(err, docs){
                    //tbc
                    resolve();
                });
            });
        }).then((d)=>{ console.log('after import'); console.log(d);  })
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