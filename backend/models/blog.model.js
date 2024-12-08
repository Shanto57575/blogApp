const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
});

blogSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);