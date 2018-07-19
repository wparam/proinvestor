var bcrypt = require('bcrypt');

module.exports = (mongoose) => {
    var UserSchema = new mongoose.Schema({
        displayName: String,
        userName: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: true,
        },
        passwordConf: {
            type: String,
            required: true,
        },
        email: String,
    },{ timestamps: {} });
    
    // authenticate input against database
    UserSchema.statics.authenticate = function (username, password, callback) {
        User.findOne({ userName: username })
            .exec(function (err, user) {
                if (err) {
                    return callback(err);
                } else if (!user) {
                    var err1 = new Error('User not found.');
                    err1.status = 401;
                    return callback(err1);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                });
            });
    };
    
    // hashing a password before saving it to the database
    UserSchema.pre('save', function (next) {
        var user = this;
        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
    
    
    return mongoose.model('user', UserSchema);
};

