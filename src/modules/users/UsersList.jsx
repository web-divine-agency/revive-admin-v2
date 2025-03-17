import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";

import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Users.scss";

import Global from "@/util/global";

import { snackbar } from "@/util/helper";

import NavSidebar from "@/components/navigation/NavSidebar";
import NavTopbar from "@/components/navigation/NavTopbar";
import TableDefault from "@/components/tables/TableDefault";

import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import BranchService from "@/services/BranchService";

export default function UsersList() {
  const navigate = useNavigate();
  const location = useLocation();

  const { authUser } = useContext(Global);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const [roles, setRoles] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState("");

  const [branches, setBranches] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState("");

  const [userDeleteModalOpen, setUserDeleteModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const handleListUsers = (last, direction, show, find) => {
    let branch_id = branches.find(
      (item) => item.name === selectedBranchName
    )?.id;

    UserService.list(
      {
        last: last || moment().format("YYYYMMDDHHmmss"),
        direction: direction || "next",
        show: show || 10,
        find: find || "",
        role: selectedRoleName,
        branch_id: branch_id,
      },
      authUser?.token
    )
      .then((response) => {
        setUsers(response.data.users);
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
        setBranches(response.data.branches);
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

  const handleDeleteUser = () => {
    UserService.delete(selectedUser.id, {}, authUser?.token)
      .then(() => {
        handleListUsers();
        setUserDeleteModalOpen(false);
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
    handleAllRoles();
    handleAllBranches();
  }, []);

  useEffect(() => {
    if (location.pathname === "/users") {
      handleListUsers();
    }
  }, [selectedRoleName, selectedBranchName, location.pathname]);

  const filtersEl = (
    <React.Fragment>
      <Box sx={{ minWidth: 128 }} className="filter-el">
        <FormControl fullWidth size="small">
          <InputLabel id="roles-select-label">Roles</InputLabel>
          <Select
            labelId="roles-select-label"
            id="roles-select"
            value={selectedRoleName}
            label="Roles"
            onChange={(event) => {
              setSelectedRoleName(event.target.value);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {roles?.map((item, i) => (
              <MenuItem value={item.name} key={i}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 128 }} className="filter-el">
        <FormControl fullWidth size="small">
          <InputLabel id="branches-select-label">Branches</InputLabel>
          <Select
            labelId="branches-select-label"
            id="branches-select"
            value={selectedBranchName}
            label="Branches"
            onChange={(event) => {
              setSelectedBranchName(event.target.value);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {branches?.map((item, i) => (
              <MenuItem value={item.name} key={i}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Helmet>
        <title>Accounts | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="users-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Account Management
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button component={Link} to="/users/create" variant="contained">
                  Create User
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={true}
                  filters={filtersEl}
                  data={users}
                  tableName="users"
                  header={["Name", "Role", "Email", "Branches", "Actions"]}
                  onChangeData={(last, dir, show, find) =>
                    handleListUsers(last, dir, show, find)
                  }
                >
                  {users?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ position: "relative", pl: 5 }}>
                        <Box
                          component={"img"}
                          src={
                            item.gender === "Male"
                              ? "/assets/man.png"
                              : "/assets/woman.png"
                          }
                          alt={item.gender}
                          sx={{
                            width: 32,
                            height: 32,
                            position: "absolute",
                            left: 0,
                            top: 8,
                          }}
                        />
                        {item.last_name}, {item.first_name}
                      </TableCell>
                      <TableCell>{item.role_name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {JSON.parse(item.all_branches)
                          ?.map((item) => item.name)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedUser(item);
                              setUserDetailsModalOpen(true);
                            }}
                          >
                            <VisibilityIcon color="green" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <IconButton component={Link} to={`/users/${item.id}`}>
                            <EditIcon color="blue" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedUser(item);
                              setUserDeleteModalOpen(true);
                            }}
                          >
                            <DeleteIcon color="red" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableDefault>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Modal
        open={userDetailsModalOpen}
        onClose={() => setUserDetailsModalOpen(false)}
        className="user-details-modal"
      >
        <Paper elevation={4} className="modal-holder">
          <Box className="modal-header">
            <Typography>User Details</Typography>
            <IconButton onClick={() => setUserDetailsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box className="modal-body">
            {selectedUser && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 3 }}>
                  <Box
                    component={"img"}
                    src={
                      selectedUser.gender === "Male"
                        ? "/assets/man.png"
                        : "/assets/woman.png"
                    }
                    alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    className="profile-image"
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 9 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          label="First name"
                          value={selectedUser.first_name}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          label="Last name"
                          value={selectedUser.last_name}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          label="Username"
                          value={selectedUser.username}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          label="Role"
                          value={selectedUser.role_name}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          label="Email"
                          value={selectedUser.email}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          multiline
                          fullWidth
                          size="small"
                          label="Branches"
                          value={selectedUser.all_branches}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setUserDetailsModalOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
      <Modal
        open={userDeleteModalOpen}
        onClose={() => setUserDeleteModalOpen(false)}
        className="user-delete-modal"
      >
        <Paper elevation={4} className="modal-holder">
          <Box className="modal-header">
            <Typography>Delete User</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="are-you-sure">Are you sure?</Typography>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setUserDeleteModalOpen(false)}
              className="mui-btn mui-btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={() => handleDeleteUser()}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
