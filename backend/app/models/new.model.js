
//mongoose only auto create collection when index is provided
module.exports = (mongoose) => {
    const stockSchema = mongoose.Schema({
        url: { type: String, index: true, unique: true },
        datetime: Date, //Apple Inc.,
        headline: String, //Nasdaq Global Select,
        source: String, //Computer Hardware,
        summary: String, //http://www.apple.com,
        related: String, //Apple Inc is an American multinational technology company. It designs, manufactures, and markets mobile communication and media devices, personal computers, and portable digital music players.,
    },{ timestamps: {} });
    return mongoose.model('new', stockSchema);
};



