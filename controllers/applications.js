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

module.exports = {
    search
};
