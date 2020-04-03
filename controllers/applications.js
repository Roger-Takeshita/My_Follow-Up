const Job = require('../models/job');

async function search(req, res) {
    try {
        //mongo query
        console.log(req.params[0]);
        //response
        res.json('ok');
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

async function newApplication(req, res) {
    try {
        const application = await Job.findOne({ link: req.body.link }).where({ user: req.user });
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
            }).select('-createdAt -updatedAt -user -followup.createdAt -followup.updatedAt -__v');
            res.json(cleanFollowup);
        } else {
            console.log('Link already exsists');
            res.status(400).json({ error: 'Link aready exist' });
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
        // await Job.find({ user: req.user })
        //     .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
        //     .limit(parseInt(req.query.docs, 10))
        //     .select('-createdAt -updatedAt -user -followup.createdAt -followup.updatedAt -__v')
        //     .exec(async (err, docs) => {
        //         const temp = [...docs];
        //         temp[0].followup = await docs[0].followup.sort((a, b) => b.date - a.date);
        //         applications = temp;
        //     });
        const applications = await Job.find({ user: req.user })
            .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
            .limit(parseInt(req.query.docs, 10))
            .select('-createdAt -updatedAt -user -followup.createdAt -followup.updatedAt -__v');
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
        let application = await Job.findOne({ _id: req.params.id })
            .where({ user: req.user })
            .select('-user -createdAt -updatedAt -__v');
        if (application) {
            if (req.body.title) {
                const allowedKeys = ['title', 'company', 'link', 'jobDescription', 'appliedOn', 'rejectedOn', 'resume', 'coverLetter', 'status', 'star'];
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
        res.json(await Job.findOneAndDelete({ _id: req.params.id, user: req.user }));
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function newFollowup(req, res) {
    try {
        const application = await Job.findById(req.params.id)
            .where({ user: req.user })
            .select('-title -company -link -jobDescription -appliedOn -rejectedOn -resume -coverLetter -user -status -star -createdAt -updatedAt -__v');
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
    console.log(req.params.id, req.params.followId);
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
