const express = require('express');
const db = require('../Config/db');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, password} = req.body;
    const postQuery = `INSERT INTO users (email, password) VALUES ($1, $2);`;
    const getQuery = `SELECT * FROM users WHERE email = $1;`;

    db.query(getQuery, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.rows.length > 0) {
                    res.status(200).json({ message: 'User already exists' });
                } else {
                    db.query(postQuery, [username, password], (err, results) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({ message: 'Internal Server Error' });
                        } else {
                            res.status(200).json({ message: 'User created successfully' });
                        }
                    });
                }
    });
     
});

router.get('/', (req, res) => {
    const query = `SELECT * FROM users`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
