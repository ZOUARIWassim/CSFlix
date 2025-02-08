const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: 'An error occurred' });
        } else {
            res.status(200).json({ message: 'User logged out successfully' });
        }
    });
});

module.exports = router;
