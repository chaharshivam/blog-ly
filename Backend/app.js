require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const commentsRouter = require('./routes/comments');

const app = express();

// Connect to Mongo DB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// passport Strategy
require('../Backend/middlewares/passport');

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);

// Error Handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({ message: "Error Occured", err });
});

module.exports = app;