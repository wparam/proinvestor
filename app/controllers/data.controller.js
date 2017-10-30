const httpProxy = require('http-proxy');
const config = require('../../config');
const proxy = httpProxy.createProxyServer({
    changeOrigin: false,
    prependPath: false,
    ignorePath: true,
    target: config.dateService.host
});

const prefix = '/api/data';

proxy.on('proxyReq', (proxyReq, req, res) =>{
    proxyReq.path = req.url.replace(prefix, '');
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
        headers:{
            'X-Auth-Token':  req.session.curuser.token //'d77f95e0-1c76-45c2-af90-f3aac241dc44' 
        }}
    );
};