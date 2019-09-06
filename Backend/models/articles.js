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
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Users'
    },
    likes: {
        type: [mongoose.Types.Schema.ObjectId],
        ref: 'Users'
    },
    tags: {
        type: [mongoose.Types.Schema.ObjectId],
        ref: 'Tags'
    },
    comments: {
        type: [mongoose.Types.Schema.ObjectId],
        ref: 'Comments'
    }
}, { timestamps: true });

const Articles = mongoose.model('Articles', articleSchema);

module.exports = Articles;