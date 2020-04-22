const Job = require('../models/job');

function allowedKeys(application, body) {
    const allowedKeys = [
        'title',
        'company',
        'link',
        'jobDescription',
        'appliedOn',
        'rejectedOn',
        'resume',
        'coverLetter',
        'status',
        'star'
    ];
    allowedKeys.forEach((key) => (application[key] = body[key]));
}

async function search(req, res) {
    try {
        const words = req.query.search.split(' ').filter((word) => word.length >= 2);
        const re = words.map((word) => new RegExp(word, 'i'));
        const applications = await Job.find({
            $or: [
                { jobDescription: { $in: re } },
                { title: { $in: re } },
                { company: { $in: re } },
                { link: { $in: re } },
                { 'followup.description': { $in: re } }
            ]
        })
            .where({ user: req.user._id })
            .populate('followup')
            .select('-__v -followup.__v');
        if (applications) {
            res.json(applications);
        } else {
            res.status(404).json({ error: 'No applications were found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function newApplication(req, res) {
    try {
        const application = await Job.findOne({ link: req.body.link }).where({ user: req.user._id });
        if (!application) {
            const newApplication = new Job();
            req.body.title = capitalLetters(req.body.title);
            req.body.company = capitalLetters(req.body.company);
            allowedKeys(newApplication, req.body);
            newApplication['user'] = req.user._id;
            const newSavedDoc = await newApplication.save();
            const followup = req.body.followup;
            if (followup.length > 0) {
                for (let i = 0; i < followup.length; i++) {
                    newSavedDoc.followup.push({
                        description: followup[i].description,
                        date: new Date(followup[i].date)
                    });
                    await newSavedDoc.save();
                }
            }
            const cleanFollowup = await Job.findById({
                _id: newSavedDoc._id
            }).select('-__v -followup.createdAt -followup.updatedAt -followup.__v');
            res.json(cleanFollowup);
        } else {
            res.status(400).json({ error: 'Link aready exists' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getApplications(req, res) {
    try {
        await Job.find({ user: req.user._id })
            .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
            .limit(parseInt(req.query.docs, 10))
            .select('-createdAt -updatedAt -__v -followup.createdAt -followup.updatedAt -followup.__v')
            .exec(async (err, docs) => {
                if (docs) {
                    const applications = await docs.map((application) => {
                        return {
                            star: application.star,
                            _id: application._id,
                            title: application.title,
                            company: application.company,
                            link: application.link,
                            jobDescription: application.jobDescription,
                            appliedOn: application.appliedOn,
                            rejectedOn: application.rejectedOn,
                            resume: application.resume,
                            coverLetter: application.coverLetter,
                            status: application.status,
                            user: application.user,
                            followup: [...application.followup.sort((a, b) => b.date - a.date)]
                        };
                    });
                    res.json(applications);
                } else {
                    res.status(400).json({ error: "You don't have applications atm!" });
                }
            });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateApplication(req, res) {
    try {
        const application = await Job.findOne({ _id: req.params.id })
            .where({ user: req.user._id })
            .select('-__v');
        if (application) {
            const isLinkExist = await Job.findOne({ link: req.body.link }).select('_id');
            if (!isLinkExist || `${isLinkExist._id}` === `${application._id}`) {
                if (req.body.title) {
                    allowedKeys(application, req.body);
                } else {
                    application.star = !application.star;
                }
                res.json(await application.save());
            } else {
                res.status(400).json({ error: 'Link already exists' });
            }
        } else {
            res.status(400).json({ error: 'Application not found!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function deleteApplication(req, res) {
    try {
        res.json(await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id }));
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function newFollowup(req, res) {
    try {
        const application = await Job.findById(req.params.id)
            .where({ user: req.user._id })
            .select(
                '-title -company -link -jobDescription -appliedOn -rejectedOn -resume -coverLetter -user -status -star -__v -followup.createdAt -followup.updatedAt -followup.__v'
            );
        if (application) {
            application.followup.push({
                description: req.body.description,
                date: new Date()
            });
            await application.save();
            res.json(application.followup[application.followup.length - 1]);
        } else {
            res.status(400).json({ error: 'Application not found!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateFollowup(req, res) {
    try {
        const application = await Job.findOne({ _id: req.params.id, user: req.user._id }).select(
            '-title -company -link -jobDescription -appliedOn -rejectedOn -resume -coverLetter -user -status -star -__v -followup.createdAt -followup.updatedAt -followup.__v'
        );
        if (application) {
            const followup = application.followup.id(req.params.followId);
            if (followup.date.toString().split('T')[0] !== req.body.date)
                followup.date = new Date(req.body.date);
            followup.description = req.body.description;
            await application.save();
            res.json(followup);
        } else {
            res.status(404).json({ error: 'Follow-up not found!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function deleteFollowup(req, res) {
    try {
        const application = await Job.findOne({ _id: req.params.id, user: req.user._id });
        if (application) {
            const followup = application.followup.id(req.params.followId);
            followup.remove();
            await application.save();
            res.json(req.params.followId);
        } else {
            res.status(404).json({ error: 'Application not found!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

function capitalLetters(str) {
    str = str.split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

module.exports = {
    search,
    newApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    newFollowup,
    updateFollowup,
    deleteFollowup
};
