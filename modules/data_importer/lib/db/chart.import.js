const Importer = require('../importer');
const http = require('http');
const _  = require('lodash');

module.exports = class ChartImporter extends Importer{
    constructor(models, forceMode){
        super(models, forceMode);
        this._modelName = 'chart';
        this.model = this.models[this._modelName];
        this.api = '/api/stock/stock/market/batch?symbols={companies}&types=chart&range=5y';
        this.companyModel = this.models['company'];
    }
    static importerType(){
        return 'chart';
    }

    import() {
        return this.beforeImport().then((d)=>{
            if(d.clean)
                logger.info(`Clean up finished before import:${this._modelName}`);
            return new Promise((resolve, reject) => {
                this.companyModel.find({}, 'symbol', function(err, docs){
                    if(err)
                        return reject(err);
                    resolve(docs);
                });
            });
        })
        .then(this.getData.bind(this))
        .then(this.insertData.bind(this))
        .then((d)=>{ console.log('after import'); console.log(d);  })
        .catch((err)=>{
            console.log(err.stack);
        }).then(this.afterImport.bind(this));
    }

    getData(companies){
        if(!companies || companies.length === 0)
            return Promise.resolve([]);
        let cpstr = this.compressCompany(companies);
        let promise = null;
        return cpstr.map((cp)=>{
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
                        if(r instanceof Array){
                            r.forEach((c)=>{
                                c.datevalue = new Date(c.date).getTime()
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
        });
    }

    compressCompany(companies){
        //since querystr max length roughly 2000 charactors, 
        
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

    importMany(data) {
        if(!data || data.length === 0){
            throw new Error('Fail at Company"s insertMany function');
        }
    }
}