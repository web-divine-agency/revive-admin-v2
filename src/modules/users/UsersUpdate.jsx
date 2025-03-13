import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./Users.scss";

import Global from "@/util/global";

import { snackbar } from "@/util/helper.jsx";

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";

import UserService from "@/services/UserService";
import BranchService from "../../services/BranchService";
import RoleService from "../../services/RoleService";

export default function UsersUpdate() {
  const { userId } = useParams();

  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState("");

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
                    <MenuItem value={""}>&nbsp;</MenuItem>
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
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl fullWidth size="small">
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
