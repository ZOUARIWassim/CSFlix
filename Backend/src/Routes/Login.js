const express = require('express');
const db = require('../Config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req,res) => {
    const { username, password} = req.body;
    const getQuery = `SELECT * FROM Users WHERE email = $1 AND password = $2;`;
    db.query(getQuery, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        } else if (results.rows.length > 0) {
            req.session.user = username;
            let accessToken = jwt.sign(
                { username: username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            req.session.authorization = { accessToken: accessToken };
            res.status(200).json({ message: 'User logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    })
})

module.exports = router;