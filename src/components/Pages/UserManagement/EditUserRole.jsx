import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function EditUserRole() {
  const location = useLocation();
  const { roleData } = location.state || {};

  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState({
    generateTicket: false,
    viewTicketHistory: false,
    viewUsersList: false,
    manageUsers: false,
    viewBranches: false,
    manageAccount: false,
    viewStaffLogs: false
  });

  useEffect(() => {
    if (roleData) {
      setRole(roleData.name);
      const updatedPermissions = {};
      roleData.permissions.forEach(permission => {
        updatedPermissions[permission] = true;
      });
      setPermissions(prevPermissions => ({
        ...prevPermissions,
        ...updatedPermissions
      }));
    }
  }, [roleData]);

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions(prevPermissions => ({
      ...prevPermissions,
      [name]: checked
    }));
  };

  const updateUserRole = (e) => {
    e.preventDefault();

    const selectedPermissions = Object.keys(permissions).filter(permission => permissions[permission]);

    console.log(`Role updated: ${role}`);
    console.log(`Updated permissions: ${selectedPermissions.join(', ')}`);
  };

  return (
    <div className="container">
      <h3>Edit User Role</h3>
      <div className="container-content">
        <form onSubmit={updateUserRole}>
          <div className="form-group ml-5 mt-3">
            <label>Role Name:</label>
            <input
              type="text"
              className="form-control col-lg-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="form-group ml-5 mt-5">
            <label>Permissions</label> <br />
            <div className="d-flex flex-column align-items-start mt-4 mr-5">
              <div className="d-flex justify-content-between w-100 mb-3 mr-5">
                <label>
                  <input
                    type="checkbox"
                    name="generateTicket"
                    checked={permissions.generateTicket}
                    onChange={handlePermissionChange}
                  />
                  Generate Ticket
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="viewTicketHistory"
                    checked={permissions.viewTicketHistory}
                    onChange={handlePermissionChange}
                  />
                  View Ticket History
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="viewUsersList"
                    checked={permissions.viewUsersList}
                    onChange={handlePermissionChange}
                  />
                  View Users&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
              </div>
              <div className="d-flex justify-content-between w-100 mb-3">
                <label>
                  <input
                    type="checkbox"
                    name="manageUsers"
                    checked={permissions.manageUsers}
                    onChange={handlePermissionChange}
                  />
                  Manage Users
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="viewBranches"
                    checked={permissions.viewBranches}
                    onChange={handlePermissionChange}
                  />
                  View Branches&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="manageAccount"
                    checked={permissions.manageAccount}
                    onChange={handlePermissionChange}
                  />
                  Manage Account
                </label>
              </div>
              <div className="d-flex justify-content-start w-100">
                <label>
                  <input
                    type="checkbox"
                    name="viewStaffLogs"
                    checked={permissions.viewStaffLogs}
                    onChange={handlePermissionChange}
                  />
                  View Staff Logs
                </label>
              </div>
            </div>
          </div>
          <button className='submit-btn mb-4 mt-4' type="submit">UPDATE</button>
        </form>
      </div>
    </div>
  );
}

export default EditUserRole;
