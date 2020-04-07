const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resumeSchema = new Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

resumeSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.user;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    }
});

module.exports = mongoose.model('Resume', resumeSchema);
