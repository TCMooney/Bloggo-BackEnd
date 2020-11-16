const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const BlogPost = require('../../models/blogPostModel');

router.post('/new', auth, (req, res) => {
    const { title, content, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ msg: 'Please enter required fields' });
    }

    const userId = req.user.id;

    const newBlogPost = new BlogPost({
        userId,
        title,
        content,
        tags,
    });
    newBlogPost.save().then(post => res.json({
        userId: userId,
        title: post.title,
        content: post.content,
        tags: post.tags,
    }));
})

router.delete('/:id/delete', auth, (req, res) => {
    BlogPost.findById(req.params.id)
        .then(post => post.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
})

router.put('/edit/:id', auth, (req, res) => {
    BlogPost.findById(req.params.id, (err, post) => {
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        } else {
            post.title = req.body.title;
            post.content = req.body.content;
            post.tags = req.body.tags;
            post.userId = req.body.userId;

            post.save((err) => {
                if (err) {
                    console.log(err)
                    return res.json({ msg: 'an error occured' })
                } else {
                    return res.json({ msg: 'Edit successful' })
                }
            })
        }
    })
})

router.get('/getPosts', (req, res) => {
    BlogPost.find()
        .populate('userId')
        .exec()
        .then((posts) => {
            res.json(posts)
        })
        .catch((err) => {
            res.status(404).json(err)
        })
})

router.get('/searchPosts', auth, (req, res) => {
    BlogPost.find({
        $text: { $search: req.query.query }
    },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .populate('userId')
        .then(blogSearch => {
            res.json(blogSearch)
        })
        .catch((err) => {
            res.status(404).json(err)
        })
})

router.get('/getPostById/:id', auth, (req, res) => {
    BlogPost.findById(req.params.id)
        .populate('userId')
        .exec()
        .then((post) => {
            res.json(post)
        })
        .catch((err) => {
            res.status(404).json(err)
            console.log(err)
        })
})

router.get('/getPostsByUser/:userId', auth, (req, res) => {
    BlogPost.find({ userId: req.params.userId })
        .populate('userId')
        .exec()
        .then((posts) => {
            res.json(posts)
        })
        .catch((err) => {
            res.status(404).json(err)
            console.log(err)
        })
})

module.exports = router;