import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const BackendServer = import.meta.env.VITE_BackendServer;
        const checkAuth = async () => {
            try {
                const response = await fetch(BackendServer + '/user/auth/profile', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setAuth(data.auth);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const BackendServer = import.meta.env.VITE_BackendServer;
        try {
            const response = await fetch(BackendServer + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setAuth(data.auth);
                if (data.auth) {
                    navigate('/movies');
                }
            }
            return data;
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = async () => {
        const BackendServer = import.meta.env.VITE_BackendServer;
        try {
            const response = await fetch(BackendServer + '/user/logout/', {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setAuth(data.auth);
                navigate('/login');
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}
