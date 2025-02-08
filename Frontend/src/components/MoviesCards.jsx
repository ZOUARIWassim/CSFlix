import React, { use } from "react";
import "../styles/components/MoviesCards.scss";
import { useEffect, useState } from "react";

function MoviesCards() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const BackendServer = import.meta.env.VITE_BackendServer;
        const getMovies = async () => {
            try {
                const response = await fetch(BackendServer + '/movies/getMovies');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        }

        getMovies().then((data) => {
            setMovies(data);
        });
    }, []);

    return (
        <div className="MainContainer">
            <div className="Meta">
                <p>Recommended For You</p>
            </div>
            <div className="MoviesGrid">
                {movies.map((movie) => (
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