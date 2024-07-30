import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast, Slide } from 'react-toastify';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthSuccessful, setIsAuthSuccessful] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthSuccessful) {
            navigate('/dashboard');
        }
    }, [isAuthSuccessful]);

    // The login API URL
    const apiRoute = 'https://sea-lion-app-hejjs.ondigitalocean.app/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestHeaders = {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        }

        fetch(`${apiRoute}/login`, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({ password, username})
        }).then(response => {
            if (response.ok) {
                console.log('Login successful');
                return response.json();
            } else {
                console.log('Login failed');
                return response.json().then(data => {
                    let error = new Error(data.message || 'Failed to login');
                    error.response = response;
                    throw error;
                });
            }
        }).then(data => {
            console.log(data);
            // Save the token in local storage
            localStorage.setItem('token', data.token);
            setIsAuthSuccessful(true);
        }   ).catch(error => {
            console.error('Error logging in:', error);

            toast.error('Error logging in', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Slide,
                bodyStyle: {
                    width: '100%',
                    height: '100%',
                }
            });

            
        });
    }

    return (
        <>
        <h1 className="Title text-3xl text-center">SMART ENERGY METER - ADMIN CONSOLE</h1>
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-3 border-b-4 border-blue-700 hover:border-blue-500 rounded focus:outline-none focus:shadow-outline">Login</button>
            </form>
        </div>
        </>
    );
}

export default Login;