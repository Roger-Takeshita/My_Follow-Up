const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
require('dotenv').config();
require('./config/database');

const app = express();

//! Middlewares
app.use(logger('dev'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

//! API Routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'inde.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});
