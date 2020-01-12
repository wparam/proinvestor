const httpProxy = require('http-proxy');
const config = require('../../config');
const fs = require('fs');

const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    target: {
        protocol: 'https:',
        host: config.stockService.host,
        port: 443
        // pfx: fs.readFileSync(config.stockService.certFile)  //TODO: this line will cause error, not sure why
    }
});

const prefix = '/api/stock';

proxy.on('proxyReq', (proxyReq, req, res) =>{
    proxyReq.path = req.url.replace(prefix, config.stockService.prefix);
});

proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end(err);
});


exports.proxyDataService = (req, res) => {   
    proxy.web(req, res, {});
};