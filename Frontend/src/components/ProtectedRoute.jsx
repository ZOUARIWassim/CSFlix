import { useNavigate } from "react-router-dom";
import {useAuth} from '../context/AuthContext';
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { auth, loading } = useAuth();

    useEffect(() => {
        if (!loading && !auth) { 
            navigate('/login');
        }
    }, [auth, loading, navigate]);

    if (auth) {
        return children;
    }

    return null;
};

export default ProtectedRoute;