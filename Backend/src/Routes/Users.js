const express = require('express');
const router = express.Router();
const logInRoutes = require("./Login")
const logOutRoutes = require("./Logout")
const genresIds = require('../Data/GenresIds.json');
const db = require('../Config/db');

router.use('/login', logInRoutes);

router.use('/logout', logOutRoutes);

router.get('/auth/profile', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ auth: true, userId: req.session.userId });
    } else {
        res.status(401).json({ auth: false });
    }
});

router.post('/auth/rate', async (req, res) => {
    const userId = req.session.userId;
    const { movieId, rating } = req.body;

    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: TMDB_API_KEY
        }
    };
    const response = await fetch(url, options);
    if (response.ok) {
        const data = await response.json();
        genres = data.genres
        GetuserQuery = `SELECT * FROM ratings WHERE userId = ${userId} AND tmdbid = ${movieId}`;
        db.query(GetuserQuery, (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.rows.length > 0) {
                const updateQuery = `UPDATE ratings SET rating = '${rating}' WHERE userId = ${userId} AND tmdbid = ${movieId}`;
                db.query(updateQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).json({ message: 'Rating updated successfully' });
                    }
                });
            } else {
                const insertQuery = `INSERT INTO ratings (userId, tmdbid, rating) VALUES (${userId}, ${movieId},'${rating}')`;
                db.query(insertQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).json({ message: 'Rating added successfully' });
                    }
                });
            }

        });
    } else {
        console.error('An error occurred while fetching data');
    }
});

router.get('/auth/recommended', (req, res) => {
    const userId = req.session.userId;
    const ModelServer = process.env.ModelServer;
    const url = `${ModelServer}/recommendations/${userId}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            console.error(err);
    });
});

module.exports = router;
