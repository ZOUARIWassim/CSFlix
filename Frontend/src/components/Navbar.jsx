import React from 'react';
import '../styles/components/Navbar.scss';
import { MdAccountCircle } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';


function Navbar({setQuerySearch}) {
    const {logout} = useAuth();
    
    return (
        <div className="Navbar">
            <div className="NavbarLogo">
                <p>CSFlix</p>
            </div>
            <div className="SearchBar">
                <input type="text" placeholder="Search for movies, TV shows, genres, etc."
                    onChange={(e) => setQuerySearch(e.target.value)}
                />
                <FaSearch />
            </div>
            <div className="NavbarMenu">
                <ul>
                    <button>Home</button>
                    <button onClick={logout}>Logout</button>
                </ul>
                <div className="Icon">
                    <MdAccountCircle />
                </div>
            </div>
        </div>
    );
}

export default Navbar;