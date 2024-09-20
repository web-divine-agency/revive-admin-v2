import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import login_image_2 from '../../assets/images/login_image_2.png';
import axiosInstance from '../../../axiosInstance';
import Swal from 'sweetalert2'
import close from "../../assets/images/close.png";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('Admin');
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('Main');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/login', {
                username,
                password,
            });

            const { user, accessToken, refreshToken, roleName, branch } = response.data;
            // console.log("User ID:", user.id);
            if (selectedRole !== roleName) {
                // setError(`You cannot log in as ${selectedRole}. Your account role is ${userRole}.`);
                Swal.fire({
                    title: 'Role Mismatch',
                    text: 'Please select your assigned role.',
                    imageUrl: close,
                    imageWidth: 100,
                    imageHeight: 100,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#EC221F",
                    customClass: {
                        confirmButton: "custom-error-confirm-button",
                        title: "custom-swal-title",
                    },
                })
                return;
            }
            if (selectedBranch !== branch) {
                // setError(`You cannot log in as ${selectedRole}. Your account role is ${userRole}.`);
                Swal.fire({
                    title: 'Wrong Branch',
                    text: 'Please select your designated branch.',
                    imageUrl: close,
                    imageWidth: 100,
                    imageHeight: 100,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#EC221F",
                    customClass: {
                        confirmButton: "custom-error-confirm-button",
                        title: "custom-swal-title",
                    },
                })
                return;
            }
            document.cookie = `role_name=${roleName}; Path=/;`;
            document.cookie = `accessToken=${accessToken}; Path=/;`;
            document.cookie = `refreshToken=${refreshToken}; Path=/; `;

            localStorage.setItem('loginSuccess', 'true');
            if (roleName === 'Admin') {
                // console.log(user, accessToken, refreshToken, roleName);
                navigate('/userlist');
            } else {
                navigate('/generate-tickets');
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                title: 'Invalid username or password!',
                text: 'Please check your credentials',
                imageUrl: close,
                imageWidth: 100,
                imageHeight: 100,
                confirmButtonText: "OK",
                confirmButtonColor: "#EC221F",
                customClass: {
                    confirmButton: "custom-error-confirm-button",
                    title: "custom-swal-title",
                },
            })
            return;
        }
    };

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axiosInstance.get('/branchLogin');
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchBranches();
    }, []);




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
                        <h2 className="text-center mb-4">{error ? 'Login Failed' : 'Login'}</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={login}>
                            <div className="d-flex mb-3">
                                <h6>
                                    <select
                                        id="branch"
                                        className="form-control-sm"
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                    >
                                        <option value="">Branch</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.branch_name}>
                                                {branch.branch_name}
                                            </option>
                                        ))}
                                    </select>
                                </h6>
                            </div>
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
                                    <select
                                        id="role"

                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    >


                                        <option value="Admin">Admin</option>
                                        <option value="Staff">Staff</option>
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
