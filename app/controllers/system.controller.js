const si = require('systeminformation');


exports.getCurrentLoad = (req, res, next)=>{
    si.currentLoad((data)=>{
        res.json(data);
    });
};


exports.mem = (req, res, next)=>{
    si.mem((data)=>{
        res.json(data);
    });
};


exports.disk = (req, res, next)=>{
    si.diskLayout((data)=>{
        res.json(data);
    });
};