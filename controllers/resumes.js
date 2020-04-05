const Resume = require('../models/resume');

async function newResume(req, res) {
    try {
        const resume = await Resume.findOne({ title: req.body.title }).where({ user: req.user });
        if (!resume) {
            try {
                const newResume = new Resume(req.body);
                newResume.user = req.user._id;
                res.json(await newResume.save());
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
        const resumes = await Resume.find({ user: req.user._id })
            .where({ user: req.user })
            .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
            .limit(parseInt(req.query.docs, 10))
            .select('-user -createdAt -updatedAt -__v');
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
        const resume = await Resume.findOne({ _id: req.params.id }).where({ user: req.user }).select('-user -createdAt -updatedAt -__v');
        resume.title = req.body.title;
        resume.description = req.body.description;
        res.json(await resume.save());
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function deleteResume(req, res) {
    try {
        res.json(await Resume.findOneAndDelete({ _id: req.params.id, user: req.user }));
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    newResume,
    getResumes,
    updateResume,
    deleteResume
};
