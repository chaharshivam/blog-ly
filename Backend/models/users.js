const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 4
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: new RegExp('@.*[.]')
    },
    password: {
        type: String,
        required: true
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
    favourites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Articles'
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    
    bcrypt.hash(user.password, 8, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

userSchema.methods.validatePassword = function (textPassword, cb) {
    bcrypt.compare(textPassword, this.password, (err, isValidated) => {
        if (err) return next(err);

        return cb(null, isValidated);
    });
};

const Users = mongoose.model('Users', userSchema);

module.exports = Users;