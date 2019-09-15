const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Comment = require('../models/comments');
const Article = require('../models/articles');

/* DELETE - particlular comment */

module.exports = router;