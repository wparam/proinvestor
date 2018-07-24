const httpProxy = require('http-proxy');
const config = require('../../config');
const fs = require('fs');

const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    prependPath: false,
    ignorePath: false,
    target: {
        protocol: 'https:',
        host: config.stockService.host,
        port: 443,
        pfx: fs.readFileSync(config.stockService.certFile)
    }
});

const prefix = '/api/stock';

proxy.on('proxyReq', (proxyReq, req, res) =>{
    console.log('hit');
    proxyReq.path = req.url.replace(prefix, config.stockService.prefix);
    console.log(proxyReq);
    console.log(req.url);
});

proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    console.error(err);
    res.end('Something went wrong');
});


exports.proxyDataService = (req, res) => {    
    proxy.web(req, res, {        
        // headers:{
        //     // 'X-Auth-Token':  req.session.curuser.token //'d77f95e0-1c76-45c2-af90-f3aac241dc44' 
        // }
        }
    );
};