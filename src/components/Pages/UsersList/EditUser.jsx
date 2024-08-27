import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditUser() {
    const { userId } = useParams(); // Assuming you're using React Router for routing
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState('');
    const [username, setUsername] = useState('');

    // Temporary data for branches and roles
    const branches = ['Manila', 'Cebu', 'Davao'];
    const roles = ['Staff', 'Admin'];

    useEffect(() => {
        // Fetch the existing user data using the userId
        // Replace this with actual data fetching logic
        // For example, using fetch or axios to get data from an API
        const fetchUserData = async () => {
            // Simulated user data
            const userData = {
                lastname: 'Doe',
                firstname: 'John',
                branch: 'Manila',
                password: 'password123',
                role: 'Staff',
                email: 'john.doe@example.com',
                sex: 'Male',
                username: 'johndoe',
            };

            setLastname(userData.lastname);
            setFirstname(userData.firstname);
            setBranch(userData.branch);
            setPassword(userData.password);
            setRole(userData.role);
            setEmail(userData.email);
            setSex(userData.sex);
            setUsername(userData.username);
        };

        fetchUserData();
    }, [userId]);

    const updateUser = (e) => {
        e.preventDefault();
        console.log(`Updating user: ${lastname}, ${firstname}, ${sex}, ${branch}, ${password}, ${role}, ${email}`);
        // Add your update logic here
    };

    return (
        <div className="container">
            <h3>Edit User</h3>
            <div className="container-content">
                <form onSubmit={updateUser}>
                    <div className="d-flex justify-content-between ml-5 mr-5 pt-4">
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input type="text" className="form-control" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>First Name:</label>
                            <input type="text" className="form-control" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Sex:</label><br />
                            <select value={sex} onChange={(e) => setSex(e.target.value)}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ml-5 mr-5">
                        <div className="form-group">
                            <label>Username:</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input type="password" className="form-control" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ml-5">
                        <div className="form-group">
                            <label>Branch:</label><br />
                            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                                <option value="">Select Branch</option>
                                {branches.map((branch, index) => (
                                    <option key={index} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Role:</label><br />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Select Role</option>
                                {roles.map((role, index) => (
                                    <option key={index} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mr-5">
                            <label>Email:</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <button className='submit-btn mb-4 mt-4' type="submit">UPDATE</button>
                </form>
            </div>
        </div>
    );
}

export default EditUser;
