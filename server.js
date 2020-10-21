const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');
const port = process.env.PORT || 3001;

require('dotenv').config();
require('./config/database');
const app = express();

const usersPath = require('./routes/users');
const applicationsPath = require('./routes/applications');
const resumesPath = require('./routes/resumes');
const searchPath = require('./routes/search');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/users', usersPath);
app.use('/api/applications', applicationsPath);
app.use('/api/resumes', resumesPath);
app.use('/api/search', searchPath);

app.get('/*', (_, res) => {
    res.send({ error: "Path doesn't exist" });
});

app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});
