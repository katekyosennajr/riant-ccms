const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/upload
// @desc    Upload gambar
// @access  Private
router.post('/', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Tidak ada file yang diupload' });
        }

        res.json({
            fileName: req.file.filename,
            filePath: `/uploads/${req.file.filename}`
        });
    } catch (err) {
        console.error(err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ msg: 'Ukuran file terlalu besar' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;