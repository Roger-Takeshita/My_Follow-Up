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
        const application = await Job.findOne({ link: req.body.link });
        if (!application) {
            const newApplication = new Job();
            newApplication.user = req.user._id;
            newApplication.title = req.body.title;
            newApplication.company = req.body.company;
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
            res.json(newSavedDoc);
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
module.exports = {
    search,
    newApplication
};
