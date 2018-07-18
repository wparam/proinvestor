const http = require('https');
const fs = require('fs');


if (process.env.NODE_ENV !== 'production'){
    require('longjohn');
  }
//NODE_DEBUG="tls https http" node test.js
//curl -i -H "Accept: *" -H "Content-Type: application/json" -X GET https://www.nasdaq.com/quotes/nasdaq-100-stocks.aspx?render=download works


const str = 'https://www.nasdaq.com/quotes/nasdaq-100-stocks.aspx?render=download';

const requestOptions = {
    hostname: 'www.nasdaq.com',
    port: 443,
    path: '/quotes/nasdaq-100-stocks.aspx',
    method: 'GET',
    query: 'render=download',
    search: '?render=download',
    headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language' : 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    }
};


const options = {
    hostname: 'encrypted.google.com',
    port: 443,
    path: '/',
    method: 'GET'
  };


var file = fs.createWriteStream("file.csv");

process.on('uncaughtException', function(err) {
    console.error(err.stack);
    process.exit();
});


const getRemoteData = () => {
    console.log('start');
    return new Promise((resolve, reject) => {
        const req = http.request( requestOptions, (res)=> {
            console.log('finish request');
            // res.pipe(file);
            const {statusCode} = res;
            const contentType = res.headers['content-type'];
            const contentDisposition = res.headers['content-disposition'];
            console.log(contentDisposition);
            let error;  
            if(statusCode!==200){
                error = new Error(`Request Failed: StatusCode: ${statusCode} `);
            }

            if(error){
                res.resume();
                return reject(error);
            }

            res.setEncoding('utf8');
            let rawData = '';

            res.on('data', (chunk)=>{
                rawData += chunk;
            });

            res.on('end', ()=>{
                const parsedData = JSON.parse(rawData);
                console.log(parsedData);
                resolve(rawData);
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
}).catch((err)=>{
    console.log('hit error');
    console.log(err.stack);
});