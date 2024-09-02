import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function EditUserRole() {
  const location = useLocation();
  const { roleData } = location.state || {};

  const rolePermissionsMap = {
    Staff: ['generateTicket', 'viewTicketHistory', 'manageAccount'],
    Admin: ['manageUsers', 'viewStaffLogs', 'viewTicketHistory', 'viewUsersList', 'manageAccount']
  };

  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState({
    generateTicket: false,
    viewTicketHistory: false,
    viewUsersList: false,
    manageUsers: false,
    viewBranches: false,
    manageAccount: false,
    viewStaffLogs: false,
  });

  useEffect(() => {
    if (roleData) {
      setRole(roleData.name);
      const rolePermissions = rolePermissionsMap[roleData.name] || [];
      const updatedPermissions = rolePermissions.reduce((acc, permission) => {
        acc[permission] = true;
        return acc;
      }, {});
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        ...updatedPermissions,
      }));
    }
  }, [roleData]);

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const updateUserRole = (e) => {
    e.preventDefault();

    const selectedPermissions = Object.keys(permissions).filter(
      (permission) => permissions[permission]
    );

    console.log(`Role updated: ${role}`);
    console.log(`Updated permissions: ${selectedPermissions.join(", ")}`);
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
            <div className="d-flex flex-row justify-content-between mr-5">
              <div className="d-flex flex-column align-items-start">
                <label className="mb-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="generateTicket"
                    checked={permissions.generateTicket}
                    onChange={handlePermissionChange}
                  />
                  Generate Ticket
                </label>
                <label className="mb-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="viewTicketHistory"
                    checked={permissions.viewTicketHistory}
                    onChange={handlePermissionChange}
                  />
                  View Ticket History
                </label>
                <label className="mb-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="viewUsersList"
                    checked={permissions.viewUsersList}
                    onChange={handlePermissionChange}
                  />
                  View Users
                </label>
              </div>
              <div className="d-flex flex-column align-items-start">
                <label className="mb-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="manageUsers"
                    checked={permissions.manageUsers}
                    onChange={handlePermissionChange}
                  />
                  Manage Users
                </label>
                <label className="mb-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="viewBranches"
                    checked={permissions.viewBranches}
                    onChange={handlePermissionChange}
                  />
                  View Branches
                </label>
                <label className="mb-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="manageAccount"
                    checked={permissions.manageAccount}
                    onChange={handlePermissionChange}
                  />
                  Manage Account
                </label>
              </div>
              <div className="d-flex flex-column align-items-start">
                <label className="mb-3">
                  <input
                    className="mr-2"
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
          <button className="submit-btn mb-4 mt-4" type="submit">
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserRole;
