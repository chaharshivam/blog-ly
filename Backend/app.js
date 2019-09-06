require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Connect to Mongo DB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// Error Handler
app.use( (err, req, res, next) => {
	res.status(err.status || 500);
	res.json({ message: "Error Occured" });
});

module.exports = app;