const si = require('systeminformation');


exports.getCurrentLoad = (req, res, next)=>{
    si.currentLoad((data)=>{
        res.json(data);
    });
};