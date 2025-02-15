import React, { use } from "react";
import "../styles/components/MoviesCards.scss";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

function MoviesCards({ querySerach, listTitle }) {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    useEffect(() => {
        const BackendServer = import.meta.env.VITE_BackendServer;
        const APIServer = import.meta.env.VITE_APIServer;

        const getMovies = async () => {
            try {
                const response = await fetch(BackendServer + '/movies/getMovies');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        const getUserId = async () => {
            try {
                const response = await fetch(BackendServer + '/user/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.auth) {
                    return data.userId;
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        const getRecommendedMovies = async () => {
            try {
                const userId = await getUserId();

                const response = await fetch(APIServer + `/recommend/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.error) {
                    console.error(data.error);
                    return [];
                }
                else {
                    const moviesFetched = [];
                    for (const movieId of data.tmdbIds) {
                        const url = BackendServer + `/movies/getMovie/${movieId}`;
                        const options = {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                            },
                            credentials: 'include',
                        };
                        const response = await fetch(url, options);
                        if (response.ok) {
                            const data = await response.json();
                            moviesFetched.push(data);
                        } else {
                            console.error('An error occurred while fetching data');
                        }
                    }
                    return moviesFetched;
                    }
                
            } catch (error) {
                console.error("Error fetching recommended movies:", error);
            }
        };


        if (listTitle === "Recommended For You") {
            const userId = localStorage.getItem('userId');
            getRecommendedMovies().then((data) => {
                setMovies(data);
                setFilteredMovies(data);
            }
            );
        }else{
            getMovies().then((data) => {
                setMovies(data);
                setFilteredMovies(data);
            });
        }
    }, []);

    const filterMovies = (movies, query) => {
        if (!query) {
            return movies;
        }

        return movies.filter((movie) => {
            const movieName = movie.title.toLowerCase();
            return movieName.includes(query.toLowerCase());
        });
    }

    useEffect(() => {
        const filteredMovies = filterMovies(movies, querySerach);
        setFilteredMovies(filteredMovies);
    }, [querySerach]);

    const handleRate = (movieID,rating) => {
        for (let i = 1; i <= rating; i++) {
            document.getElementById(`Rate${movieID}-${i}`).style.color = "#cd8107";
        }
        for (let i = rating + 1; i <= 5; i++) {
            document.getElementById(`Rate${movieID}-${i}`).style.color = "#f1c40f";
        }
        const BackendServer = import.meta.env.VITE_BackendServer;
        const rateMovie = async () => {
            try {
                const response = await fetch(BackendServer + '/user/auth/rate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        movieId: movieID,
                        rating: rating,
                    }),
                    credentials: 'include',
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error rating movie:", error);
            }
        };

        rateMovie().then((data) => {
            console.log(data);
        });
    }

    return (
        <div className="MainContainer">
            <div className="Meta">
                <p>{listTitle}</p>
            </div>
            <div className="MoviesGrid">
                {listTitle === "All Movies" && filteredMovies.map((movie) => (
                    <div key={movie.id} className="MovieCard">
                        <div className="MovieImg">
                            <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt={"No Poster is Available"} />
                        </div>
                        <div className="MovieInfo">
                            <p>{movie.title}</p>
                            <p>{movie.release_date}</p>
                                <div className="MovieRating">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            id={`Rate${movie.id}-${index + 1}`}
                                            onClick={() => handleRate(movie.id, index + 1)}
                                        />
                                    ))}
                                </div>
                        </div>
                    </div>
                ))}
                {listTitle === "Recommended For You" && filteredMovies.map((movie) => (
                    <div key={movie.id} className="MovieCard">
                        <div className="MovieImg">
                            <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt={"No Poster is Available"} />
                        </div>
                        <div className="MovieInfo">
                            <p>{movie.title}</p>
                            <p>{movie.release_date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MoviesCards;