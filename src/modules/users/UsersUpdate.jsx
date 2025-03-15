import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import "./Users.scss";

import Global from "@/util/global";

import { snackbar } from "@/util/helper.jsx";

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";

import UserService from "@/services/UserService";
import BranchService from "@/services/BranchService";
import RoleService from "@/services/RoleService";

export default function UsersUpdate() {
  const { userId } = useParams();

  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    username: "",
    branchIds: [],
    roleId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [branches, setBranches] = useState({
    names: [],
    list: [],
  });

  const [roles, setRoles] = useState([]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  const handleError = (key) => {
    delete errors[key];
    setErrors((errors) => ({ ...errors }));
  };

  const handleReadUser = () => {
    UserService.read(userId, authUser?.token)
      .then((response) => {
        let branches = JSON.parse(response.data.user.all_branches);

        setUser({
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          gender: response.data.user.gender,
          username: response.data.user.username,
          branchIds: branches.flatMap((i) => i.id),
          roleId: response.data.user.role_id,
          email: response.data.user.email,
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  const handleAllBranches = () => {
    BranchService.all(authUser?.token)
      .then((response) => {
        setBranches({
          names: response.data.branches.flatMap((branch) => branch.name),
          list: response.data.branches,
        });
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  const handleAllRoles = () => {
    RoleService.all(authUser?.token)
      .then((response) => {
        setRoles(response.data.roles);
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  useEffect(() => {
    handleReadUser();
    handleAllBranches();
    handleAllRoles();
  }, []);

  const handleUpdateUser = () => {
    UserService.update(
      userId,
      {
        first_name: user.firstName,
        last_name: user.lastName,
        branch_ids: user.branchIds,
        password: user.password,
        email: user.email,
        gender: user.gender,
        role_id: user.roleId,
        auth_id: authUser?.id,
      },
      authUser?.token
    )
      .then(() => {
        navigate("/users");
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          snackbar(error.response.data.msg, "error", 3000);
        } else if (error.response.status === 422) {
          setErrors(error.response.data.error);
          snackbar("Invalid input found", "error", 3000);
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
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
                            <Chip key={i} label={item?.name} />
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
                        {item.name}
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
                  onClick={() => handleError("last_name")}
                  error={"last_name" in errors}
                  helperText={"last_name" in errors ? errors["last_name"] : ""}
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
                  onClick={() => handleError("first_name")}
                  error={"first_name" in errors}
                  helperText={
                    "first_name" in errors ? errors["first_name"] : ""
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl fullWidth size="small" error={"gender" in errors}>
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
                  {"gender" in errors && (
                    <FormHelperText>{errors["gender"]}</FormHelperText>
                  )}
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
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl fullWidth size="small" error={"role_id" in errors}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                    name="roleId"
                    value={user.roleId}
                    onChange={(event) => handleOnChange(event)}
                  >
                    <MenuItem value="">&nbsp;</MenuItem>
                    {roles?.map((item, i) => (
                      <MenuItem value={item.id} key={i}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {"role_id" in errors && (
                    <FormHelperText>{errors["role_id"]}</FormHelperText>
                  )}
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
                  onClick={() => handleError("email")}
                  error={"email" in errors}
                  helperText={"email" in errors ? errors["email"] : ""}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={"password" in errors}
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    name="password"
                    value={user.password}
                    onChange={(event) => handleOnChange(event)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {"password" in errors && (
                    <FormHelperText>{errors["password"]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={user.password !== user.confirmPassword}
                >
                  <InputLabel htmlFor="password">Confirm password</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    label="Confirm password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={(event) => handleOnChange(event)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {user.password !== user.confirmPassword && (
                    <FormHelperText>Password doesn&apos;t match</FormHelperText>
                  )}
                </FormControl>
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
