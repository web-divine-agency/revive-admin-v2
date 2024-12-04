import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./UsersCreate.scss";

import { snackbar } from "../../../util/helper";

import NavTopbar from "../../Navigation/nav-topbar/NavTopbar";
import NavSidebar from "../../Navigation/nav-sidebar/NavSidebar";

import axiosInstance from "../../../../axiosInstance";

export default function UsersCreate() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    username: "",
    branch: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validation = () => {
    if (
      !user.lastName ||
      !user.firstName ||
      !user.branch ||
      !user.password ||
      !user.confirmPassword ||
      !user.email ||
      !user.gender ||
      !user.username ||
      !user.role
    ) {
      return "All fields are required.";
    }
    if (user.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (user.password !== user.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      return "Invalid email format.";
    }

    return "";
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  const handleCreateUser = () => {
    let valid = validation();

    if (valid) {
      snackbar(valid, "error");
    }

    axiosInstance
      .post("/addUser", {
        last_name: user.lastName,
        first_name: user.firstName,
        branch_ids: [1, 2, 3],
        password: user.password,
        email: user.email,
        sex: user.gender,
        username: user.username,
        role_name: user.role,
      })
      .then(() => {
        navigate("/userlist");
      })
      .catch(() => {
        snackbar("Oops! something went wrong", "error");
      });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Users Create | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="users-create" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Create User
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="lastName"
                  label="Last name"
                  value={user.lastName}
                  onChange={(event) => handleOnChange(event)}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="firstName"
                  label="First name"
                  value={user.firstName}
                  onChange={(event) => handleOnChange(event)}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender-select"
                    label="Gender"
                    name="gender"
                    value={user.gender}
                    onChange={(event) => handleOnChange(event)}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="username"
                  label="Username"
                  value={user.username}
                  onChange={(event) => handleOnChange(event)}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="branch-select-label">Branch</InputLabel>
                  <Select
                    labelId="branch-select-label"
                    id="branch-select"
                    label="Branch"
                    name="branch"
                    value={user.branch}
                    onChange={(event) => handleOnChange(event)}
                  >
                    <MenuItem value={"b1"}>Branch 1</MenuItem>
                    <MenuItem value={"b2"}>Branch 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                    name="role"
                    value={user.role}
                    onChange={(event) => handleOnChange(event)}
                  >
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Staff"}>Staff</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="email"
                  label="Email"
                  value={user.email}
                  onChange={(event) => handleOnChange(event)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="password"
                  label="Password"
                  value={user.password}
                  onChange={(event) => handleOnChange(event)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="confirmPassword"
                  label="Confirm password"
                  value={user.confirmPassword}
                  onChange={(event) => handleOnChange(event)}
                />
              </Grid>
              <Grid size={{ xs: 12 }} textAlign={"right"}>
                <Button
                  variant="contained"
                  color="black"
                  className="mui-btn mui-btn-cancel"
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleCreateUser}>
                  Create
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
