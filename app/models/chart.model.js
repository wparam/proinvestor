
//mongoose only auto create collection when index is provided
module.exports = (mongoose) => {
    const chartSchema = mongoose.Schema({
        symbol: String,
        date: String, //Apple Inc.,
        change: Number,
        changeOverTime: Number,
        changePercent: Number,
        close: Number,
        high: Number,
        label: String,
        low: Number,
        open: Number,
        unadjustedVolume: Number,
        volume: Number,
        vwap: Number
    },{ timestamps: {} });

    chartSchema.index({symbol: 1, date: 1}, {unique: true});
    
    return mongoose.model('chart', chartSchema);
};



