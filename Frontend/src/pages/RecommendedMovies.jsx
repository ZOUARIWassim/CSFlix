import React from "react";
import Navbar from "../components/Navbar";
import MoviesCards from "../components/MoviesCards";
import "../styles/pages/Movies.scss";
import { useEffect, useState } from "react";

function Movies() {
    const [querySerach, setQuerySearch] = useState('');

    return (
        <>
            <Navbar setQuerySearch = {setQuerySearch}/>
            <MoviesCards querySerach = {querySerach} listTitle={"Recommended For You"} />
        </>
    );
}

export default Movies;