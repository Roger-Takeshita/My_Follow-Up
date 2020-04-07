const Job = require('../models/job');

async function search(req, res) {
    try {
        const words = req.query.search.split(' ').filter((word) => word.length > 3);
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
            console.log('No applications were found');
            res.status(404).json({ error: 'No applications were found' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function newApplication(req, res) {
    try {
        const application = await Job.findOne({ link: req.body.link }).where({ user: req.user._id });
        if (!application) {
            const newApplication = new Job();
            newApplication.user = req.user._id;
            newApplication.title = capitalLetters(req.body.title);
            newApplication.company = capitalLetters(req.body.company);
            newApplication.link = req.body.link;
            newApplication.jobDescription = req.body.jobDescription;
            newApplication.resume = req.body.resume;
            newApplication.appliedOn = req.body.appliedOn;
            newApplication.rejectedOn = req.body.rejectedOn;
            newApplication.status = req.body.status;
            newApplication.coverLetter = req.body.coverLetter;
            newApplication.star = req.body.star;
            const newSavedDoc = await newApplication.save();
            const followup = req.body.followup;
            if (followup.length > 0) {
                for (let i = 0; i < followup.length; i++) {
                    newSavedDoc.followup.push({
                        description: followup[i],
                        date: new Date()
                    });
                    await newSavedDoc.save();
                }
            }
            const cleanFollowup = await Job.findById({
                _id: newSavedDoc._id
            }).select('-__v -followup.createdAt -followup.updatedAt -followup.__v');
            res.json(cleanFollowup);
        } else {
            console.log('Link already exsists');
            res.status(400).json({ error: 'Link aready exists' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getApplications(req, res) {
    try {
        //= This approach is working, needs to be refactored
        // let applications;
        // await Job.find({ user: req.user._id })
        //     .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
        //     .limit(parseInt(req.query.docs, 10))
        //     .select('-createdAt -updatedAt -user -followup.createdAt -followup.updatedAt -__v')
        //     .exec(async (err, docs) => {
        //         const temp = [...docs];
        //         temp[0].followup = await docs[0].followup.sort((a, b) => b.date - a.date);
        //         applications = temp;
        //     });
        const applications = await Job.find({ user: req.user._id })
            .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
            .limit(parseInt(req.query.docs, 10))
            .select('-__v -followup.createdAt -followup.updatedAt -followup.__v');
        if (applications) {
            res.json(applications);
        } else {
            console.log("You don't have applications atm!");
            res.status(400).json({ error: "You don't have applications atm!" });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateApplication(req, res) {
    try {
        const application = await Job.findOne({ _id: req.params.id })
            .where({ user: req.user._id })
            .select('-__v');
        if (application) {
            if (req.body.title) {
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
                allowedKeys.forEach((key) => (application[key] = req.body[key]));
            } else {
                application.star = !application.star;
            }
            res.json(await application.save());
        } else {
            console.log('Application not found!');
            res.status(400).json({ error: 'Application not found!' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function deleteApplication(req, res) {
    try {
        if (req.user._id === '5e8bab22dc743074b97c758b') {
            console.log('Sorry this user is not allowed to delete applications!');
            return res.status(400).json({ error: 'Sorry this user is not allowed to delete applications!' });
        } else {
            res.json(await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id }));
        }
    } catch (err) {
        console.log('Something went wrong', err);
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
            console.log('Application not found!');
            res.status(400).json({ error: 'Application not found!' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function deleteFollowup(req, res) {
    try {
        const application = await Job.findOne({ _id: req.params.id });
        if (application) {
            const followup = application.followup.id(req.params.followId);
            followup.remove();
            await application.save();
            res.json(req.params.followId);
        } else {
            console.log('Application not found!');
            res.status(404).json({ error: 'Application not found!' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
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
    deleteFollowup
};
