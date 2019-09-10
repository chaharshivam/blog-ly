const express = require('express');
const router = express.Router();
const article = require('../controllers/article');
const auth = require('../middlewares/auth');

/* GET all articles */
/* TODO: Pagination */
router.get('/', article.all);

/* POST - create article */
router.post('/', auth.verifyToken, article.create);

/* GET article by ID */
router.get('/:id', auth.verifyToken, article.read);

/* PATCH - Update an article */ 
router.patch('/:id', auth.verifyToken, article.update);

/* DELETE - Delete an article */
router.delete('/:id', auth.verifyToken, article.delete);

/* POST - Like an article */
router.post('/:id/like', auth.verifyToken, article.like);

/* TODO: unlike logic */

/* GET - get comments on article */
router.get('/:id/comments', article.getComments);

/* POST - create comment on article */
router.post('/:id/comments', auth.verifyToken, article.addComment);

module.exports = router;