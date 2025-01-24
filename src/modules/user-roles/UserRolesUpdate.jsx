import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Swal from "sweetalert2";

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

import "./UserRoles.scss";

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";

import check from "@/assets/images/check.png";

export default function UserRolesUpdate() {
  //const location = useLocation();
  //const { roleData } = location.state || {};

  const navigate = useNavigate();
  const { roleId } = useParams();

  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchRoleData = () => {
      if (roleId) {
        try {
          const response = {};
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

    try {
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
