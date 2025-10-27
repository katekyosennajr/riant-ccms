const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Ambil token dari header
    const token = req.header('x-auth-token');

    // Cek jika tidak ada token
    if (!token) {
        return res.status(401).json({ msg: 'Tidak ada token, akses ditolak' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tambahkan user dari payload
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token tidak valid' });
    }
};