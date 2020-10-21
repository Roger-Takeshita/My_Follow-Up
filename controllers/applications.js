const Job = require('../models/job');

const allowedKeys = async (application, body) => {
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
        'star',
    ];
    allowedKeys.forEach((key) => (application[key] = body[key]));
};

const formatObj = (application) => {
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
        followup: [...application.followup.sort((a, b) => b.date - a.date)],
    };
};

const newApplication = async (req, res) => {
    try {
        const application = await Job.findOne({
            link: req.body.link,
            user: req.user._id,
        });
        if (!application) {
            const newApplication = new Job();
            req.body.title = req.body.title.toLowerCase();
            req.body.company = req.body.company.toLowerCase();
            allowedKeys(newApplication, req.body);
            newApplication.user = req.user._id;
            await newApplication.save();
            const followup = req.body.followup;

            if (followup.length > 0) {
                for (let i = 0; i < followup.length; i++) {
                    newApplication.followup.push({
                        description: followup[i].description,
                        date: new Date(followup[i].date),
                    });
                    await newApplication.save();
                }
            }

            const cleanFollowup = await Job.findById({
                _id: newApplication._id,
            }).select(
                '-__v -createdAt -updatedAt -followup.createdAt -followup.updatedAt -followup.__v'
            );

            res.json(cleanFollowup);
        } else {
            res.status(400).json({ error: 'Link already exists' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const getApplications = async (req, res) => {
    try {
        const startDoc = (req.query.page - 1) * parseInt(req.query.docs, 10);
        const limit = parseInt(req.query.docs, 10);

        await Job.find({ user: req.user._id })
            .skip(startDoc)
            .limit(limit)
            .exec((_, docs) => {
                if (docs) {
                    const applications = docs.map((application) => {
                        return formatObj(application);
                    });

                    res.json(applications);
                } else {
                    res.status(400).json({
                        error: "You don't have applications atm!",
                    });
                }
            });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateApplication = async (req, res) => {
    try {
        const application = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (application) {
            const isLinkExist = await Job.findOne({
                link: req.body.link,
                user: req.user._id,
            }).select('_id');
            if (
                !isLinkExist ||
                isLinkExist._id.toString() === application._id.toString()
            ) {
                if (req.body.title) {
                    allowedKeys(application, req.body);
                } else {
                    application.star = !application.star;
                }

                return res.json(await application.save());
            }
            return res.status(400).json({ error: 'Link already exists' });
        }

        res.status(404).json({ error: 'Application not found!' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteApplication = async (req, res) => {
    try {
        res.json(
            await Job.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id,
            })
        );
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const newFollowup = async (req, res) => {
    try {
        const application = await Job.find({
            _id: req.params.id,
            user: req.user._id,
        }).select('followup._id followup.description followup.date');
        if (application) {
            application.followup.push({
                description: req.body.description,
                date: new Date(),
            });
            await application.save();
            return res.json(
                application.followup[application.followup.length - 1]
            );
        }
        res.status(400).json({ error: 'Application not found!' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateFollowup = async (req, res) => {
    try {
        const application = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).select('followup._id followup.description followup.date');
        if (application) {
            const followup = application.followup.id(req.params.followId);
            if (followup.date.toString().split('T')[0] !== req.body.date)
                followup.date = new Date(req.body.date);
            followup.description = req.body.description;
            await application.save();
            return res.json(followup);
        }
        res.status(404).json({ error: 'Follow-up not found!' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteFollowup = async (req, res) => {
    try {
        const application = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (application) {
            const followup = application.followup.id(req.params.followId);
            followup.remove();
            await application.save();
            return res.json(req.params.followId);
        }
        res.status(404).json({ error: 'Application not found!' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = {
    newApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    newFollowup,
    updateFollowup,
    deleteFollowup,
};
