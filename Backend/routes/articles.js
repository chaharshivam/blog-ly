const express = require('express');
const router = express.Router();
const article = require('../controllers/article');
const auth = require('../middlewares/auth');

/* GET all articles */
router.get('/', article.all);

/* POST - create article */
router.post('/', auth.verifyToken, article.create);

/* GET - articles from people I follow */
router.get('/feed', auth.verifyToken, article.feed);

/* GET article by ID */
router.get('/:slug', auth.verifyToken, article.read);

/* PUT - Update an article */ 
router.put('/:slug', auth.verifyToken, article.update);

/* DELETE - Delete an article */
router.delete('/:slug', auth.verifyToken, article.delete);

/* POST - Like an article */
router.put('/:slug/like', auth.verifyToken, article.like);

/* TODO: unlike logic */
router.delete(':slug/like', auth.verifyToken, article.unlike);
/* GET - get comments on article */
router.get('/:slug/comments', article.getComments);

/* POST - create comment on article */
router.put('/:slug/comments', auth.verifyToken, article.addComment);

/* Delete Comment route */
router.delete('/:slug/comments/:id', auth.verifyToken, article.deleteComment);

module.exports = router;