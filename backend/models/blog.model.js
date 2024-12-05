const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    category: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Blog', blogSchema);

