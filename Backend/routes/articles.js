const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const Tag = require('../models/tags');
const auth = require('../middlewares/auth');

/* GET all articles */
router.get('/', function (req, res, next) {
    Article.find({}, (err, articles) => {
        if (err) return next(err);

        res.status(200).json({ articles });
    });
});

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

        res.json({ article });
    });
});

module.exports = router;

