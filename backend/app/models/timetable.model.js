module.exports = mongoose => {
    const timetableSchema = mongoose.Schema({
        timeid: { type: String, index: true },
        timestamp: String, 
        loaded: Boolean
    },{ timestamps: {} });
    timetableSchema.index({timeid: 1}, {unique: true});
    return mongoose.model('timetable', timetableSchema);
};