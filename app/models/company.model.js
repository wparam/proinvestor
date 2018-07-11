const mongoose = require('mongoose');

//mongoose only auto create collection when index is provided
const stockSchema = mongoose.Schema({
    ticker: { type: String, index: true },
    companyName: String, //Apple Inc.,
    exchange: String, //Nasdaq Global Select,
    industry: String, //Computer Hardware,
    website: String, //http://www.apple.com,
    description: String, //Apple Inc is an American multinational technology company. It designs, manufactures, and markets mobile communication and media devices, personal computers, and portable digital music players.,
    CEO: String, //Timothy D. Cook,
    issueType: String, //cs, ??
    sector: String, //Technology
});

module.exports = mongoose.model('Company', stockSchema);
