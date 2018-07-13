const mongoose = require('mongoose');

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

module.exports = mongoose.model('Basket', basketSchema);