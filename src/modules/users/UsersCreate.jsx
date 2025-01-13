import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./Users.scss";

import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import axiosInstance from "@/services/axiosInstance";

export default function UsersCreate() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    username: "",
    branchIds: [],
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [branches, setBranches] = useState({
    names: [],
    list: [],
  });

  const validation = () => {
    if (
      !user.lastName ||
      !user.firstName ||
      !user.branchIds.length ||
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
      return;
    }

    axiosInstance
      .post("/addUser", {
        last_name: user.lastName,
        first_name: user.firstName,
        branch_ids: user.branchIds,
        password: user.password,
        email: user.email,
        sex: user.gender,
        username: user.username,
        role_name: user.role,
      })
      .then(() => {
        navigate("/users");
      })
      .catch(() => {
        snackbar("Oops! something went wrong", "error");
      });
  };

  const handleGetBranches = () => {
    axiosInstance
      .get("/branches")
      .then((response) => {
        setBranches({
          names: response.data.flatMap((branch) => branch.branch_name),
          list: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetBranches();
  }, []);

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
              <Grid size={{ xs: 12 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="branches-multiple-chip-label">
                    Branches
                  </InputLabel>
                  <Select
                    labelId="branches-multiple-chip-label"
                    id="branches-multiple-chip"
                    multiple
                    value={user.branchIds}
                    onChange={({ target }) => {
                      setUser((user) => ({
                        ...user,
                        branchIds: target.value,
                      }));
                    }}
                    input={
                      <OutlinedInput
                        id="branches-multiple-chip"
                        label="Branches"
                      />
                    }
                    renderValue={(selected) => {
                      let names = selected.map((i) =>
                        branches.list.find((j) => j.id === i)
                      );

                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {names.map((item, i) => (
                            <Chip key={i} label={item.branch_name} />
                          ))}
                        </Box>
                      );
                    }}
                    MenuProps={{
                      style: {
                        maxHeight: 72 * 4.5 + 8,
                        width: 250,
                      },
                    }}
                  >
                    {branches.list.map((item, i) => (
                      <MenuItem key={i} value={item.id}>
                        {item.branch_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
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
                  onClick={() => navigate(-1)}
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
