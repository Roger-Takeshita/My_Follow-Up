const Job = require('../models/job');

async function search(req, res) {
    try {
        const words = req.query.search
            .split(' ')
            .filter((word) => word.length >= 2);
        const re = words.map((word) => new RegExp(word, 'i'));
        const applications = await Job.find({
            $or: [
                { jobDescription: { $in: re } },
                { title: { $in: re } },
                { company: { $in: re } },
                { link: { $in: re } },
                { 'followup.description': { $in: re } },
            ],
        })
            .where({ user: req.user._id })
            .populate('followup')
            .select('-followup.__v');
        if (!applications) {
            return res
                .status(404)
                .json({ error: 'No applications were found' });
        }

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    search,
};
