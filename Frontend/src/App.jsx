import { useState } from 'react'
import './styles/App.scss'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Movies from './pages/Movies'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/" element={<Navigate to="/Movies" />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>

  )
}

export default App
