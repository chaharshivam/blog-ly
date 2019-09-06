const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true
    },
    articles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Articles'
    }
}, { timestamps: true });

const Tags = mongoose.model('Tags', tagSchema);

module.exports = Tags;