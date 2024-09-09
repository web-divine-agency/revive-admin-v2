import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import login_image_2 from '../../assets/images/login_image_2.png';
import axiosInstance from '../../../axiosInstance';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Login function
    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/login', {
                username,
                password,
                role: isAdmin ? 'Admin' : 'Staff',
            });

            // Extract tokens from response and store them in local storage
            const { user } = response.data;
            localStorage.setItem('userRoles', JSON.stringify(user.roles));
            localStorage.setItem('userPermissions', JSON.stringify(user.roles.flatMap(role => role.permissions)));

            // Redirect to users list page
            if(isAdmin) {
                navigate('/staff-logs');
            } else
            navigate('/userlist'); // Use navigate to redirect


        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password.');
        }
    };

    // Handle dropdown change
    const handleRoleChange = (event) => {
        setIsAdmin(event.target.value === 'Admin');
    };

    return (
        <div className="d-flex align-items-center justify-content-center custom-login">
            <div className="row">
                <div className="col-lg-6 col-md-6 custom-col">
                    <div className="header-title">
                        <h3>Welcome to Revive</h3>
                        <h3>Pharmacy Price Ticket Generator</h3>
                    </div>
                    <div className='bg-image'>
                        <img className='img-fluid login_image' src={login_image_2} alt="Login" />
                    </div>
                </div>

                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="card p-4" style={{ width: '450px' }}>
                        <h2 className="text-center mb-4">{isAdmin ? 'ADMIN LOGIN' : 'STAFF LOGIN'}</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={login}>
                            <label htmlFor="username">Username</label><br />
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control-lg w-100 mb-2"
                                    value={username}
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <label htmlFor="password">Password</label><br />
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control-lg w-100 mb-2"
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="d-flex">
                                <h6>
                                    Log in as
                                    &nbsp;
                                    <select value={isAdmin ? 'Admin' : 'Staff'} onChange={handleRoleChange}>
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </h6>
                            </div>

                            <div className='d-flex justify-content-center'>
                                <button type="submit" className="btn btn-primary mt-2 custom-btn">LOGIN</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
