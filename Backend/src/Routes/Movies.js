const express = require('express');
const router = express.Router();

router.get('/getMovies', async (req, res) => {
    response = [];
    for (let page_number = 1; page_number <= 5; page_number++) {
        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page_number}`;
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: TMDB_API_KEY
        }
        };

        const page_response = await fetch(url, options)

        if (page_response.ok) {
            const page_data = await page_response.json();
            response.push(...page_data.results);
        } else {
            console.error('An error occurred while fetching data');
        }
         
    };
    res.json(response);
});

module.exports = router;
