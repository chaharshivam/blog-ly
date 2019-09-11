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
        next (err);
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
exports.read =  async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        article.description = await convertor.makeHtml(article.description);

        res.json({ article });
    } catch (err) {
        console.log(err);
        next (err);
    }
}
// Update an article
exports.update = async (req, res, next) => {
    // Allow only title and description updates
    try {
        const foundArticle = await Article.findById(req.params.id);

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
        const foundArticle = await Article.findById(req.params.id);

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

        if(foundUser.favourites.includes(req.params.id)) {
            /* TODO - unlike post */
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
// Get comments on an article
exports.getComments = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate({
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

        await Article.findByIdAndUpdate(req.params.id, { $push: { comments: createdComment.id } });

        res.json({ message: "comment added" });
    } catch (err) {
        next (err);
    }
}