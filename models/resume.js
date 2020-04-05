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

module.exports = mongoose.model('Resume', resumeSchema);
