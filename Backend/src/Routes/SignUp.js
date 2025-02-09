const express = require('express');
const db = require('../Config/db');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, password} = req.body;
    const postQuery = `INSERT INTO users (email, password) VALUES ($1, $2);`;
    const getQuery = `SELECT * FROM users WHERE email = $1;`;
    const insert_user_vector_query = `
        INSERT INTO user_vectors (
            userId, totalRatings, avgRating, 
            Adventure, Animation, Children, Comedy, Fantasy, Romance, Drama, 
            Action, Crime, Thriller, Horror, Mystery, SciFi, IMAX, Documentary, 
            War, Musical, Western, FilmNoir, noGenresListed
        ) VALUES (
            $1, 0, 0.0, 
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
            0.0, 0.0, 0.0, 0.0, 0.0
        );
    `;

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
                    GetID = `SELECT * FROM users WHERE email = $1;`;
                    db.query(GetID, [username], (err, results) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: 'Internal Server Error' });
                        }
                        let userId = results.rows[0].id;
                        db.query(insert_user_vector_query, [userId], (err, results) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: 'Internal Server Error' });
                            } else {
                                req.session.userId = userId;
                                console.log("User vector created successfully");
                            }
                        }); 
                    });
                }
            });
        }
    });
     
});

module.exports = router;
