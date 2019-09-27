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
       const articles = await Article.find()
                            .populate("author", "username")
                            .skip(10 * req.query.page)
                            .limit(10);
       res.status(200).json({ articles });
    } catch (err) {
        next (err);
    }
}
// Feed
exports.feed = async (req, res, next) => {
    try {
        const userFeed = await User.findById(req.userId)
                            .populate({
                                path: "following",
                                populate: {
                                    path: 'articles',
                                    model: 'Article'
                                }
                            })
                            .skip(10 * req.query.page).limit(10);
        res.josn ({ userFeed });
    } catch (err) {
        next (err);
    }
}

// Create an article
exports.create = async (req, res, next) => {
    try {
        let { tags, ...others } = req.body;
        
        tags = tags.split(',');
    
        // Create slug
        let slug = req.body.title.toLowerCase().split(' ').join('-');
    
        let article = {...others, author: req.userId, tags: [], slug };
    
        // Create article
        const createdArticle = await Article.create(article);
        
        tags.forEach(async tag => {
            // Create Tag & push article in it
            let upsertedTag = await Tag.findOneAndUpdate({ name: tag }, { $push: { articles: createdArticle.id }}, { upsert: true, new: true});
            // Push tags into created article
            let updatedArticle = await Article.findByIdAndUpdate(createdArticle.id, { $push: { tags: upsertedTag.id }}, { new: true });
            
            if (updatedArticle.tags.length == tags.length) {
                return res.json({ updatedArticle });
            }
        });
    } catch (err) {
        console.log(err);
        next (err);
    }
}
// Read an article
exports.read =  async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        article.description = await convertor.makeHtml(article.description);

        res.json({ article });
    } catch (err) {
        console.log(err);
        next (err);
    }
}
// Update an article
exports.update = async (req, res, next) => {
    // Allow only content and description updates
    try {
        const foundArticle = await Article.findOne({ slug: req.params.slug });

        if (foundArticle.author == req.userId) {
            const updatedArticle = await Article.findByIdAndUpdate(foundArticle.id, req.body, { new: true });

            res.json({ updatedArticle });
        } else {
            res.json({ message: "Not Authorized" });
        }
    } catch (err) {
        next (err);
    }
}
// Delete an article
exports.delete = async (req, res, next) => {
    try {
        const foundArticle = await Article.findOne({ slug: req.params.slug });

        if (foundArticle.author == req.userId) {
            const deletedArticle = await Article.findByIdAndDelete(foundArticle.id);
            
            /* TODO: Remove article from Tag and delete Comments of that article */
            res.json({ message: "Article successfully deleted" });
        }
    } catch (err) {
        next (err);
    }
}
// Like an article
exports.like = async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.userId);
        const foundArticle = await Article.findOne({ slug: req.params.slug });

        if (foundUser.favourites.includes(req.params.id)) {
            res.json({ message: "Already Liked" });
        } else {
            await Article.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });

            await User.findByIdAndUpdate(req.userId, { $push: { favourites: req.params.id }});

            res.json({ message: "Post liked" });
        }
    } catch (err) {
        next (err);
    }
}
// Unlike an article
exports.unlike = async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.userId);
        const foundArticle = await Article.findOne({ slug: req.params.slug });

        if (foundUser.favourites.includes(foundArticle.id)) {
            await User.findByIdAndUpdate(req.userId, { $pull: { favourites: foundArticle.id } });
            await Article.findByIdAndUpdate(foundArticle.id, { $inc: { likes: -1 } });
            res.json({ message: "Post unliked" });
        } else {
            res.json({ message: "Already unliked" });
        }
    } catch (err) {
        next (err);
    }
}
// Get comments on an article
exports.getComments = async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug }).populate({
            path: "comments"
        });

        res.json({ comments: article.comments })
    } catch (err) {
        next (err);
    }
}
// Add comment on article
exports.addComment = async (req, res, next) => {
    const comment = { ...req.body, author: req.userId, article: req.params.id };
    
    try {
        const createdComment = await Comment.create(comment);

        await Article.findOne({ slug: req.params.slug }, { $push: { comments: createdComment.id } });

        res.json({ message: "comment added" });
    } catch (err) {
        next (err);
    }
}
// Delete a comment
/* TODO: Change it to work with slug */
exports.deleteComment = async (req, res, next) => {
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
}