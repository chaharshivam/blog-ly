const Article = require('../models/articles');
const Tag = require('../models/tags');
const User = require('../models/users');
const Comment = require('../models/comments');
const showdown = require('showdown');

/* TODO - Use async/await */

const convertor = new showdown.Converter({ noHeaderId: true });
// All articles
exports.all =  async (req, res, next) => {
    try {
       const articles = await Article.find().skip(10 * req.query.page).limit(10);
       res.status(200).json({ articles });
    } catch (err) {
        next(err);
    }
}
// Create an article
exports.create = (req, res, next) => {

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
}
// Read an article
exports.read = (req, res, next) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return next(err);

        article.description = convertor.makeHtml(article.description);

        res.json({ article });
    });
}
// Update an article
exports.update = (req, res, next) => {
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
}
// Delete an article
exports.delete = (req, res, next) => {
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
}
// Like an article
exports.like = (req, res, next) => {
    
    User.findById(req.userId, (err, foundUser) => {
        if (err) return next(err);

        if (foundUser.favourites.includes(req.params.id)) {
            return res.json({ message: "Already Liked!" });
        } else {
            Article.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, (err, foundArticle) => {
                if (err) return next(err);
                
                User.findByIdAndUpdate(req.userId, { $push: { favourites: req.params.id } }, { upsert: true }, (err, updatedUser) => {
                    if (err) return next(err);
                    
                    res.json({ message: "Post liked" });
                });
        
            });
        }
    });
}
// Get comments on an article
exports.getComments = (req, res, next) => {
    Article
    .findById(req.params.id)
    .populate({
        path: "comments"
    })
    .exec((err, article) => {
        if (err) return next(err);
        
        res.json({ comments: article.comments });
    });
}
// Add comment on article
exports.addComment = (req, res, next) => {
    const comment = { ...req.body, author: req.userId, article: req.params.id };
    
    Comment.create(comment, (err, createdComment) => {
        if (err) return next(err);

        Article.findByIdAndUpdate(req.params.id, { $push: { comments: createdComment.id } }, (err, updatedArticle) => {
            if (err) return next(err);

            res.json({ message: "Comment Added!" });
        });
    });
}