const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: async (value) => {
                if (!(await validator.isEmail(value))) {
                    throw new Error('Email is invalid');
                }
            },
        },
        password: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
        },
        googleId: {
            type: String,
        },
        unsuccessfulLogins: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }

    next();
});

userSchema.methods.comparePassword = function (tryPassword, callback) {
    bcrypt.compare(tryPassword, this.password, callback);
};

userSchema.set('toJSON', {
    transform: function (_, ret) {
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.admin;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('User', userSchema);
