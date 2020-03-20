const Resume = require('../models/resume');

async function newResume(req, res) {
    try {
        const resume = await Resume.findOne({ title: req.body.title });
        if (!resume) {
            try {
                const newResume = new Resume(req.body);
                newResume.user = req.user._id;
                const resume = await newResume.save();
                res.json(resume);
            } catch (err) {
                console.log('Something went wrong', err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        } else {
            console.log('Title already exsists');
            res.status(400).json({ error: 'Title aready exist' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getResumes(req, res) {
    try {
        const resumes = await Resume.find({ user: req.user._id });
        if (resumes) {
            res.json(resumes);
        } else {
            console.log("You don't have resumes!");
            res.status(400).json({ error: "You don't have resumes!" });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateResume(req, res) {
    try {
        console.log(req.body);
        const resume = await Resume.findOne({ _id: req.params.id });
        resume.title = req.body.title;
        resume.description = req.body.description;
        await resume.save();
    } catch (error) {}
}

module.exports = {
    newResume,
    getResumes,
    updateResume
};
