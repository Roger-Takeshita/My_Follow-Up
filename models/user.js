const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        admin: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: String
        },
        googleId: {
            type: String
        },
        unsuccessfulLogins: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

//! Mongoose Middleware
//+ Encrypt the password
userSchema.pre('save', function (next) {
    const user = this;
    console.log(user.isModified('password'));
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

//+ Compare password
userSchema.methods.comparePassword = function (tryPassword, cb) {
    bcrypt.compare(tryPassword, this.password, cb);
};

//+ Return
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.admin;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
