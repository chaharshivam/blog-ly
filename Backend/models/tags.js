const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: String,
    articles: [mongoose.Types.Schema.ObjectId]
}, { timestamps: true });

const Tags = mongoose.model('Tags', tagSchema);

module.exports = Tags;