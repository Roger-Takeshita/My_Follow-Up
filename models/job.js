const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followUpSchema = new Schema(
    {
        description: {
            type: String
        },
        date: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        appliedDate: {
            type: Date
        },
        extraInfo: {
            type: String
        },
        customResume: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        followUp: [followUpSchema],
        status: {
            type: String,
            enum: ['Pending', 'Applied', 'Rejected']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Job', jobSchema);
