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
            res.status(500).json({ message: 'An error occurred while logging in', auth: false });
        } else if (results.rows.length > 0) {
            req.session.user = username;
            let accessToken = jwt.sign(
                { username: username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            req.session.authorization = { accessToken: accessToken };
            GetID = `SELECT * FROM users WHERE email = $1;`;
            db.query(GetID, [username], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                let userId = results.rows[0].id;
                req.session.userId = userId;
                res.status(200).json({ message: 'User logged in successfully', auth: true });
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password', auth: false });
        }
    })
})

module.exports = router;