const express = require('express');
const router = express.Router();
const Tag = require('../models/tags');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET popular tags */
router.get('/tags', function(req, res, next) {
  Tag.find({}, (err, tags) => {
    if (err) return next(err);

    tags = tags.sort((a, b) => {
      return a.articles.length - b.articles.length;
    }).slice(0, 10);

    return res.status(200).json({ tags });
  });
});

module.exports = router;