import React, { useState } from 'react';



function AddNewUser() {
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

  const addUser = (e) => {
    e.preventDefault();
    console.log(`Adding new user: ${lastname}, ${firstname}, ${sex}, ${branch}, ${password}, ${role}, ${email}`);
  };

  return (
    <div className="container">
      <h3>Add New User</h3>
      <div className="container-content">
        <form onSubmit={addUser}>
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
              <select
                value={sex} 
                onChange={(e) => setSex(e.target.value)} 
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between ml-5 mr-5">
            <div className="form-group">
              <label>Username</label>
              <input type="password" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
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
          <button className='submit-btn mb-4 mt-4' type="submit">SAVE</button>
        </form>
      </div>
    </div>
  );
}

export default AddNewUser;
