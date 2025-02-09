import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useLocation } from 'react-router-dom';
import './styles/App.scss'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Movies from './pages/Movies'
import RecommendedMovies from './pages/RecommendedMovies'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

function App() {
  const location = useLocation();

  useEffect(() => {
    const rootElement = document.getElementById('root');
    rootElement.className = ''; 
    if (location.pathname === '/login' || location.pathname === '/signup') {
      rootElement.classList.add('page-login');
    } else {
      rootElement.classList.add('page-home');
    }
  }, [location]);

  return (
    <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/movies" element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          } />
          <Route path="/recommended" element={
            <ProtectedRoute>
              <RecommendedMovies />
            </ProtectedRoute>
          } />
        </Routes>
    </AuthProvider>
  )
}

export default App
