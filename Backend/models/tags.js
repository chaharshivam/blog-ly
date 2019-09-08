const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }]
}, { timestamps: true });

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;