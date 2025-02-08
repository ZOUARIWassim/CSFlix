import React from "react";
import Navbar from "../components/Navbar";
import MoviesCards from "../components/MoviesCards";
import "../styles/pages/Movies.scss";

function Movies() {


    return (
        <>
            <Navbar />
            <MoviesCards />
        </>
    );
}

export default Movies;