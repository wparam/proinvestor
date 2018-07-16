const mongoose = require('mongoose');
const constr = 'mongodb://localhost/asset_manager';

module.exports = class Importer{
    constructor(conn){
        this.conn = conn;
        if(!conn)
            this.conn = mongoose.connection;
    }
    openConnection() {
        return new Promise((resolve, reject) => {
            if(this.conn.readyState === 0){
                this.conn = mongoose.connect(constr, {useMongoClient: true});
            }
    
            this.conn.on('open', () => {
                resolve('DB is open');
            });
            
            this.conn.on('error', (err) => {
                reject(err);
            });
        });
    }
    closeConnection() {
        return new Promise((resolve, reject) => {
            if(conn.readyState === 1){
                mongoose.disconnect();        
            }
            resolve('Db is closed');
        });
    }
    getRemoteData(){

    }
    processData() {
        
    }
    saveData() {

    }
    import() {
    }

}   