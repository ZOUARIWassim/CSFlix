import React, { useState } from "react";
import '../styles/components/LogIn.scss';
import { FaUserAlt, FaLock } from "react-icons/fa";
import {Link} from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [message, setMessage] = useState('');
    const [isIncorrect, setIsIncorrect] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();
        const BackendServer = import.meta.env.VITE_BackendServer;
        try {
            if (email && password && repassword) {
                if (password !== repassword){
                    setMessage('Passwords do not match');
                }else{
                    const response = await fetch(BackendServer + '/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username: email, password }),
                        credentials: 'include',


                        
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setMessage(data.message);
                    }
                }
            }else{
                
                setMessage('Please fill all the fields');
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="loginForm">
            <div className="inputDiv">
                <h1>Welcome </h1>
                <p>Welcome! Please enter your details</p>
                <form onSubmit={handleSignin}>
                    <label>Email</label>
                    <div className="inputBox">
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaUserAlt className="icon" />
                    </div>
                    <label>Password</label>
                    <div className="inputBox">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (repassword !== e.target.value) {
                                    setIsIncorrect(true)
                                } else {
                                    setIsIncorrect(false)
                                }
                            }}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="inputBox"  >
                        <input
                            type="password"
                            id={isIncorrect ? 'isIncorrect' : 'isCorrect'}
                            placeholder="Re-enter your password"
                            value={repassword}
                            onChange={(e) => {
                                setRepassword(e.target.value)
                                if (password !== e.target.value) {
                                    setIsIncorrect(true)
                                } else {
                                    setIsIncorrect(false)
                                }
                            }}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <input type="submit" value="SignUp" className="loginBtn" />
                    <button>Sign in with Google</button>

                </form>
                
                {message && <div className="message"><p>{message}</p></div>}

                <div className="registerlink">
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>               
            </div>
            <div className="assetDiv">
                <svg className="responsive-svg" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50%" cy="50%" r="20%" stroke="none" fill="#7f56da" />
                </svg>
            </div>
        </div>
    );
}

export default SignUp;
