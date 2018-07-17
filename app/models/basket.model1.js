const mongoose = require('mongoose');

module.exports = (connection) => {
    console.log('conn is ');
    console.log(connection);
    if(!connection)
        connection = mongoose.connection;
    const basketSchema = mongoose.Schema({
        name: {
            type: String,
            index: true,
            required: true,
            unique: true
        },
        componentUrl: String,
        componentType: String
    }, { timestamps: {} });
    return connection.model('basket', basketSchema);
};