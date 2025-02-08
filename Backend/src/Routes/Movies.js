const express = require('express');
const router = express.Router();

router.get('/getMovies', async (req, res) => {
    response = [];
    for (let page_number = 1; page_number <= 5; page_number++) {
        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page_number}`;
        const options = {
            method : 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
            }
        };
        const page_response = await fetch(url, options);

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
