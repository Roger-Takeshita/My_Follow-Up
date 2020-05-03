const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const port = process.env.PORT || 3001;

require('dotenv').config();
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/users', require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/resumes', require('./routes/resumes'));

app.get('/*', (req, res) => {
    res.send({ error: "Path doesn't exist" });
});

app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});
