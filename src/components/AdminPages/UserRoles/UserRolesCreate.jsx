import React, { useState } from "react";
import axiosInstance from "../../../../axiosInstance.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import check from "../../../assets/images/check.png";
import { Helmet } from "react-helmet";
import NavTopbar from "../../Navigation/nav-topbar/NavTopbar.jsx";
import NavSidebar from "../../Navigation/nav-sidebar/NavSidebar.jsx";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./UserRolesCreate.scss";

export default function UserRolesCreate() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  const defaultPermissions = [
    { permission_name: "Generate Ticket", permission_id: 1 },
    { permission_name: "View Ticket History", permission_id: 4 },
    { permission_name: "Manage Account", permission_id: 7 },
  ];

  const addUserRole = async (e) => {
    e.preventDefault();

    const roleData = {
      role_name: role,
      role_description: roleDescription,
    };

    try {
      // Create the role first
      const roleResponse = await axiosInstance.post("/create-role", roleData);
      const { message } = roleResponse.data;

      if (roleResponse && roleResponse.data) {
        const newRoleId = parseInt(message.split(": ")[1]);

        for (const permission of defaultPermissions) {
          await axiosInstance.post("/create-rolePermission", {
            role_id: newRoleId,
            permission_id: permission.permission_id,
          });
        }

        console.log("All selected permissions assigned successfully.");
      }

      // Success alert
      Swal.fire({
        title: "Role Added Successfully",
        text: `New Role added!`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
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
    <React.Fragment>
      <Helmet>
        <title>User Roles | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="user-roles-create" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Create User Role
          </Typography>
          <Paper variant="outlined">
            <form onSubmit={addUserRole}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Button
                    onClick={() => navigate(-1)}
                    startIcon={<NavigateBeforeIcon />}
                  >
                    User Roles
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    size="small"
                    type="text"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    size="small"
                    type="text"
                    name="roleDescription"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained">
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
      <div className="container">
        <div className="container-content">
          {/*}
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
          */}
        </div>
      </div>
    </React.Fragment>
  );
}
