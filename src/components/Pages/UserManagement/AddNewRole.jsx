import React, { useState } from "react";

function AddNewRole() {
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

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const addUserRole = (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Get selected permissions
    const selectedPermissions = Object.keys(permissions).filter(
      (permission) => permissions[permission]
    );

    //concole log the output
    console.log(`New role created: ${role}`);
    console.log(`Selected permissions: ${selectedPermissions.join(", ")}`);
  };

  return (
    <div className="container">
      <h3>Add New User Role</h3>
      <div className="container-content">
        <form onSubmit={addUserRole}>
          <div className="form-group ml-5 mt-3">
            <label>New Role Name:</label>
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
                  View
                  Users
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
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewRole;
