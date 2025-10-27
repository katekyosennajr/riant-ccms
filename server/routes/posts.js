const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// @route   POST /api/posts
// @desc    Buat post baru
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, category, tags, status } = req.body;
        
        const newPost = new Post({
            title,
            content,
            category,
            tags,
            status,
            author: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/posts
// @desc    Ambil semua post
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', ['username']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/posts/:id
// @desc    Ambil post by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', ['username']);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post tidak ditemukan' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post tidak ditemukan' });
        }

        // Pastikan user adalah penulis post
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User tidak diizinkan' });
        }

        const { title, content, category, tags, status } = req.body;
        
        post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, category, tags, status },
            { new: true }
        );

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/posts/:id
// @desc    Hapus post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post tidak ditemukan' });
        }

        // Pastikan user adalah penulis post
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User tidak diizinkan' });
        }

        await post.remove();
        res.json({ msg: 'Post berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;