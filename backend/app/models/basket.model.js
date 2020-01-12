module.exports = (mongo) => {
    const basketSchema = mongo.Schema({
        name: {
            type: String,
            index: true,
            required: true,
            unique: true
        },
        componentUrl: String,
        componentType: String
    }, { timestamps: {} });
    return mongo.model('basket', basketSchema);
};

// const basketSchema = mongoose.Schema({
//     name: {
//         type: String,
//         index: true,
//         required: true,
//         unique: true
//     },
//     componentUrl: String,
//     componentType: String
// }, { timestamps: {} });

// module.exports = mongoose.model('basket', basketSchema);