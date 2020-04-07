const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followupSchema = new Schema(
    {
        description: {
            type: String,
            required: true
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
            required: true,
            unique: true
        },
        jobDescription: {
            type: String,
            required: true
        },
        appliedOn: {
            type: Date
        },
        rejectedOn: {
            type: Date
        },
        resume: {
            type: String
        },
        coverLetter: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        followup: [followupSchema],
        status: {
            type: String,
            enum: ['Pending', 'Applied', 'Rejected']
        },
        star: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

jobSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.user;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    }
});

module.exports = mongoose.model('Job', jobSchema);
