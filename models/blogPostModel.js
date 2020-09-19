const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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

BlogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model('Blogs', BlogSchema);


module.exports = Blog;