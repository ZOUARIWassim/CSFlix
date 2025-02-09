const express = require('express');
const router = express.Router();
const db = require('../Config/db');

router.get('/getMovies', async (req, res) => {
    try {
        const GetQuery = `SELECT tmdbid FROM movie_tmdb_link, movies WHERE movie_tmdb_link.movieID = movies.movieID;`;
        
        const result = await db.query(GetQuery);
        const movieIds = result.rows.slice(0, 10).map((movie) => movie.tmdbid);
        const movies = [];

        for (const movieId of movieIds) {
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
                movies.push(data);  
            } else {
                console.error('An error occurred while fetching data');
            }
        }
        res.json(movies);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getMovie/:id', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
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
        res.json(data);
    } else {
        console.error('An error occurred while fetching data');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
