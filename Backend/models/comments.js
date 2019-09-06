const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
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
    }
}, { timestamps: true });

const Comments = mongoose.model('Comments', commentSchema);