const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Comment = require('../models/comments');
const Article = require('../models/articles');

/* DELETE - particlular comment */
router.delete('/:id', auth.verifyToken,(req, res, next) => {

    Comment.findById(req.params.id, (err, foundComment) => {
        if (err) return next(err);

        if (foundComment.author == req.userId) {
            Comment.findByIdAndDelete(req.params.id, (err, deletedComment) => {
                if (err) return next(err);
        
                Article.findById(deletedComment.article, (err, foundArticle) => {
                    if (err) return next(err);
        
                    const comments = foundArticle.comments.filter( elm => elm != deletedComment.id);
        
                    Article.findByIdAndUpdate(foundArticle.id, { comments }, (err, updatedArticle) => {
                        if (err) return next(err);
        
                        res.json({ message: "Comment Successfully deleted", updatedArticle });
                    });
                });
            });
        } else {
            res.json({ message: "Not Authorised!" });
        }
    });

});


module.exports = router;