const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

BlogSchema.index({
    title: 'text',
    content: 'text'
});

module.exports = Blog = mongoose.model('Blogs', BlogSchema);