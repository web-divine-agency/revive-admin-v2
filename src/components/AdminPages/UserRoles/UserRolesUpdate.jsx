import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance.js";
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

import "./UserRolesUpdate.scss";

export default function UserRolesUpdate() {
  //const location = useLocation();
  //const { roleData } = location.state || {};

  const navigate = useNavigate();
  const { roleId } = useParams();

  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchRoleData = async () => {
      if (roleId) {
        try {
          const response = await axiosInstance.get(`/role/${roleId}`);
          const roleInfo = response.data;

          setRole(roleInfo.role_name);
          setDescription(roleInfo.role_description);
        } catch (error) {
          console.error(
            "Error fetching role data:",
            error.response ? error.response.data : error.message
          );
        }
      }
    };
    fetchRoleData();
  }, [roleId]);

  const updateUserRole = async (e) => {
    e.preventDefault();

    const updatedRoleData = {
      role_name: role,
      role_description: description,
    };

    try {
      const roleResponse = await axiosInstance.put(
        `/update-role/${roleId}`,
        updatedRoleData
      );
      if (roleResponse && roleResponse.data) {
        Swal.fire({
          title: "Role Updated Successfully",
          text: `The role has been updated!`,
          imageUrl: check,
          imageWidth: 100,
          imageHeight: 100,
          confirmButtonText: "OK",
          confirmButtonColor: "#0ABAA6",
        }).then(() => {
          navigate("/user-roles");
        });
      } else {
        console.error("Unexpected response structure:", roleResponse);
      }
    } catch (error) {
      console.error("Error updating role or assigning permissions:", error);
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
      <Box component={"section"} id="user-roles-update" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Update User Roles
          </Typography>
          <Paper variant="outlined">
            <form onSubmit={updateUserRole}>
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
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    size="small"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained">
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
