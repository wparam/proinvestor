const http = require('https');
const fs = require('fs');
const zlib = require('zlib');

if (process.env.NODE_ENV !== 'production'){
    require('longjohn');
  }
//NODE_DEBUG="tls https http" node test.js
//curl -i -H "Accept: *" -H "Content-Type: application/json" -X GET https://www.nasdaq.com/quotes/nasdaq-100-stocks.aspx?render=download works


const str = 'https://www.nasdaq.com/quotes/nasdaq-100-stocks.aspx?render=download';

const requestOptions = {
    hostname: 'www.nasdaq.com',
    port: 443,
    path: '/quotes/nasdaq-100-stocks.aspx?render=download',
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language' : 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',  //TODO: why miss this header will cause socket hangup????
    }
};


const options = {
    hostname: 'encrypted.google.com',
    port: 443,
    path: '/',
    method: 'GET'
  };


var file = fs.createWriteStream("file.csv");

const getRemoteData = () => {
    console.log('start');
    return new Promise((resolve, reject) => {
        const req = http.request( requestOptions, (res)=> {
            console.log('finish request');
            // res.pipe(file);
            const {statusCode} = res;
            const contentType = res.headers['content-type'];
            const contentEncoding = res.headers['content-encoding']
            console.log(contentEncoding);
            let error;  
            if(statusCode!==200){
                error = new Error(`Request Failed: StatusCode: ${statusCode} `);
            }

            if(error){
                res.resume();
                return reject(error);
            }
            let rs = res;
            if(contentEncoding==='gzip'){
                rs = res.pipe(zlib.createGunzip());
            }
            
            res.pipe(file)
                .on('finish', ()=>{
                    console.log('finish write file');
                    resolve('finish');
                });
        }).on('error', (err)=>{
            console.log(err);
            reject(err);
        });
        req.end();
    });
    
}
getRemoteData().then((d)=>{
    console.log('~~~~finish');
    console.log(d);
    fs.readFile('file.csv', 'utf8', (err, data)=>{
        if(err)
            throw err;
        console.log(data);
    });
}).catch((err)=>{
    console.log('hit error');
    console.log(err.stack);
});