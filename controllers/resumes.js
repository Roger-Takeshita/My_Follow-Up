const Resume = require('../models/resume');

async function newResume(req, res) {
    try {
        const resume = await Resume.findOne({ title: req.body.title }).where({ user: req.user._id });
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
            res.status(400).json({ error: 'Title aready exists' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getResumes(req, res) {
    try {
        const resumes = await Resume.find({ user: req.user._id })
            .where({ user: req.user._id })
            .skip((req.query.page - 1) * parseInt(req.query.docs, 10))
            .limit(parseInt(req.query.docs, 10))
            .select('-__v');
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
        const resume = await Resume.findById(req.params.id).where({ user: req.user._id }).select('-__v');
        if (resume) {
            const resumeCheck = await Resume.findOne({ title: req.body.title });
            if (!resumeCheck || `${resumeCheck._id}` === `${resume._id}`) {
                resume.title = req.body.title;
                resume.description = req.body.description;
                res.json(await resume.save());
            } else {
                console.log('Title already exists');
                res.status(400).json({ error: 'Title already exists' });
            }
        } else {
            console.log('Resume not found');
            res.status(400).json({ error: 'Resume not found' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function deleteResume(req, res) {
    try {
        if (req.user._id === '5e8bab22dc743074b97c758b') {
            console.log('Sorry this user is not allowed to delete resumes!');
            return res.status(400).json({ error: 'Sorry this user is not allowed to delete resumes!' });
        } else {
            res.json(await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id }));
        }
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
