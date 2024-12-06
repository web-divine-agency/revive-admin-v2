import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance.js";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavTopbar from "../../Navigation/nav-topbar/NavTopbar.jsx";
import NavSidebar from "../../Navigation/nav-sidebar/NavSidebar.jsx";
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
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { snackbar } from "../../../util/helper.jsx";

import "./UsersUpdate.scss";

export default function UsersUpdate() {
  const { userId } = useParams();

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    username: "",
    branchIds: [],
    role: " ",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [branches, setBranches] = useState({
    names: [],
    list: [],
  });

  const [roles, setRoles] = useState([]);

  // const [successMessage, setSuccessMessage] = useState("");

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  const handleReadUser = () => {
    axiosInstance
      .get(`/user/${userId}`)
      .then((response) => {
        setUser({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          gender: response.data.sex,
          username: response.data.username,
          branchIds: response.data.branches.flatMap((i) => i.id),
          role: response.data.roles[0]?.role_name,
          email: response.data.email,
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleListBranches = () => {
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

  const handleListRoles = () => {
    axiosInstance
      .get("/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleReadUser();
    handleListBranches();
    handleListRoles();
  }, []);

  const validation = () => {
    if (
      !user.lastName ||
      !user.firstName ||
      !user.branchIds.length ||
      !user.email ||
      !user.gender ||
      !user.username ||
      !user.role
    ) {
      return "All fields are required.";
    }

    if (user.password && user.password.length < 8) {
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

  const handleUpdateUser = async () => {
    let valid = validation();

    if (valid) {
      snackbar(valid, "error");
      return;
    }

    axiosInstance
      .put(`/update-user/${userId}`, {
        first_name: user.firstName,
        last_name: user.lastName,
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
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Users Update | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="users-update" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Update User
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Users
                </Button>
              </Grid>
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
                            <Chip key={i} label={item?.branch_name} />
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
                    <MenuItem value=""></MenuItem>
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
                    <MenuItem value=" ">&nbsp;</MenuItem>
                    {roles?.map((item, i) => (
                      <MenuItem value={item.role_name} key={i}>
                        {item.role_name}
                      </MenuItem>
                    ))}
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
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdateUser}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
