const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tags'
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comments'
    }
}, { timestamps: true });

const Articles = mongoose.model('Articles', articleSchema);

module.exports = Articles;