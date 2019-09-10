const express = require('express');
const showdown = require('showdown');
const router = express.Router();
const Article = require('../models/articles');
const Tag = require('../models/tags');
const Comment = require('../models/comments');
const User = require('../models/users');
const auth = require('../middlewares/auth');

const convertor = new showdown.Converter({ noHeaderId: true });

/* GET all articles */
router.get('/', function (req, res, next) {
    Article.find({}, (err, articles) => {
        if (err) return next(err);

        res.status(200).json({ articles });
    });
});

/* POST - create article */
router.post('/', auth.verifyToken, function (req, res, next) {

    let { tags, ...others } = req.body;
    
    tags = tags.split(',');

    let article = {...others, author: req.userId , tags: [] };

    // Create article
    Article.create(article, (err, createdArticle) => {
        if (err) return next(err);
        // Create tags and put article ID in them
        tags.forEach(tag => {
            Tag.findOneAndUpdate({ name: tag }, { $push: { articles: [createdArticle.id] } }, { upsert: true,  new: true}, (err, upsertedTag) => {
                if (err) return next(err);
                // Update article with tag ID's
                Article.findByIdAndUpdate(createdArticle.id, { $push: { tags: [upsertedTag] } }, { upsert: true, new: true }, (err, updatedArticle) => {
                    if (err) return next(err);

                    if (updatedArticle.tags.length == tags.length) {
                        return res.status(200).json({ message: "article successfully created" });
                    }
                });
            });
        });
    });
});


/* GET article by ID */
router.get('/:id', auth.verifyToken, function (req, res, next) {
    Article.findById(req.params.id, (err, article) => {
        if (err) return next(err);

        article.description = convertor.makeHtml(article.description);

        res.json({ article });
    });
});

/* PATCH - Update an article */ 
router.patch('/:id', auth.verifyToken, (req, res, next) => {
    // Allow only title and description updates
    Article.findById(req.params.id, (err, foundArticle) => {
        if (err) return next(err);

        if (foundArticle.author == req.userId) {
            Article.findByIdAndUpdate(foundArticle.id, req.body, (err, updatedArticle) => {
                if (err) next(err);

                res.json({ updatedArticle });
            });
        } else {
            res.json({ message: "Not Authorized" });
        }
    });
});

/* DELETE - Delete an article */
router.delete('/:id', auth.verifyToken, (req, res, next) => {
    Article.findById(req.params.id, (err, foundArticle) => {
        if (err) return next(err);

        if (foundArticle.author == req.userId) {
            Article.findByIdAndDelete(foundArticle.id, (err, deletedArticle) => {
                if (err) next(err);

                /* TODO: Remove article from Tag and delete Comments of that article */
                
                res.json({ message: "Article deleted successfully" });
            });
        } else {
            res.json({ message: "Not Authorized" });
        }
    });
});

/* POST - Like an article */
router.post('/:id/like', auth.verifyToken, (req, res, next) => {
    Article.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, (err, foundArticle) => {
        if (err) return next(err);

        User.findByIdAndUpdate(req.userId, { $push: { favourites: foundArticle.id } }, (err, updatedUser) => {
            if (err) return next(err);
            
            res.json({ message: "Post liked" });
        });

    });
});

/* TODO: unlike logic */

/* GET - get comments on article */
router.get('/:id/comments', (req, res, next) => {
    Article
    .findById(req.params.id)
    .populate({
        path: "comments"
    })
    .exec((err, article) => {
        if (err) return next(err);
        
        res.json({ comments: article.comments });
    });
});

/* POST - create comment on article */
router.post('/:id/comments', auth.verifyToken, (req, res, next) => {
    const comment = { ...req.body, author: req.userId, article: req.params.id };
    
    Comment.create(comment, (err, createdComment) => {
        if (err) return next(err);

        Article.findByIdAndUpdate(req.params.id, { $push: { comments: createdComment.id } }, (err, updatedArticle) => {
            if (err) return next(err);

            res.json({ message: "Comment Added!" });
        });
    });
});

module.exports = router;