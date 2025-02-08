import React from "react";
import '../styles/components/LogIn.scss';
import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const BackendServer = import.meta.env.VITE_BackendServer;
        try {
            if (email && password) {
                const response = await fetch(BackendServer + '/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username : email, password }),
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message);
                }
                else {
                    setMessage(data.message);;
                }
            }else{
                setMessage('Please fill all the fields');
            }
        }
        catch (error) {
            console.error("Error logging in:", error);
            setMessage('An error occurred. Please try again.');
        }
    }

    return (
        <div className="loginForm">
            <div className="inputDiv">
                <h1>Welcome Back</h1>
                <p>Welcome Back! please enter your details</p>
                <form onSubmit={handleSubmit}>
                
                    <label>Email</label>
                    <div className="inputBox">
                        <input 
                        type="email" 
                        placeholder="Enter your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                        <FaUserAlt className="icon"/>
                    </div>
                    <label>Password</label>
                    <div className="inputBox">
                        <input type="password" 
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} 
                        required />
                        <FaLock className="icon" />
                    </div>
                    <div className="rememberForget">
                    <div>
                        <input type="checkbox" className="checkbox"/>Remember me 
                    </div>
                    <a className="forgetLink" href="#">Forget password</a>
                    </div>
                    <input type="submit" value="Login" className="loginBtn" />
                    <button>Login with Google</button>
                </form>
                
                {message && <div className="message"><p>{message}</p></div>}
        
                
                <div className="registerlink">
                    <p>Don't have an account? <Link to="/signup">Register</Link></p>
                </div>               
            </div>
            <div className="assetDiv">
                <svg className="responsive-svg" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50%" cy="50%" r="20%" stroke="none" fill="#7f56da" />
                </svg>
            </div>
        </div>
    )
}

export default LogIn;