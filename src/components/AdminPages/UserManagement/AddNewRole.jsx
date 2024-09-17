import React, { useState } from "react";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AddNewRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  // const [permissions, setPermissions] = useState({
  //   generateTicket: false,
  //   viewTicketHistory: false,
  //   viewUsersList: false,
  //   manageUsers: false,
  //   viewBranches: false,
  //   manageAccount: false,
  //   viewStaffLogs: false,
  // });

  // const permissionMapping = {
  //   generateTicket: 1,
  //   viewTicketHistory: 2,
  //   viewUsersList: 3,
  //   manageUsers: 4,
  //   viewBranches: 5,
  //   manageAccount: 6,
  //   viewStaffLogs: 7,
  // };

  // const handlePermissionChange = (e) => {
  //   const { name, checked } = e.target;
  //   setPermissions((prevPermissions) => ({
  //     ...prevPermissions,
  //     [name]: checked,
  //   }));
  // };

  const addUserRole = async (e) => {
    e.preventDefault();

    // const selectedPermissions = Object.keys(permissions).filter(
    //   (permission) => permissions[permission]
    // );

    const roleData = {
      role_name: role,
      role_description: roleDescription,
    };

    try {
      // Create the role first
      const roleResponse = await axiosInstance.post("/create-role", roleData);
      const { message } = roleResponse.data;

      // if (roleResponse && roleResponse.data) {
      //   const newRoleId = parseInt(message.split(": ")[1]);
      //   await axiosInstance.post("/create-rolePermission", {
      //     role_id: newRoleId,
      //     permissions: selectedPermissions.map(
      //       (permission) => ({ permission_id: permissionMapping[permission] })
      //     ),
      //   });

      //   console.log("All selected permissions assigned successfully.");
      // }

      // Success alert
      Swal.fire({
        title: "Role Added Successfully",
        text: `New Role added!`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        navigate("/user-management");
      });
    } catch (error) {
      console.error("Error creating role or assigning permissions:", error);
      if (error.response) {
        console.error("Server responded with an error:", error.response);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
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
              required
            />
          </div>
          <div className="form-group ml-5 mt-3">
            <label>Role Description:</label>
            <textarea
              className="form-control col-lg-8"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group ml-5 mt-5">
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
          </div> */}
          <button className="submit-btn mb-4 mt-4" type="submit">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewRole;
