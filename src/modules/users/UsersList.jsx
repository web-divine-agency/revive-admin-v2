import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

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

import "./Users.scss";

import Global from "@/util/global";

import { snackbar } from "@/util/helper";

import NavSidebar from "@/components/navigation/NavSidebar";
import NavTopbar from "@/components/navigation/NavTopbar";
import TableDefault from "@/components/tables/TableDefault";

import UserService from "@/services/UserService";
import RoleService from "../../services/RoleService";
import BranchService from "../../services/BranchService";

export default function UsersList() {
  const { authUser } = useContext(Global);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const [roles, setRoles] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState("");

  const [branches, setBranches] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState("");

  const [userDeleteModalOpen, setUserDeleteModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const handleListUsers = (page = 1, show = 50) => {
    let branch_id = branches.find(
      (item) => item.name === selectedBranchName
    )?.id;

    UserService.list(
      {
        page: page,
        show: show,
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
          snackbar(error.response.data.error, "error", 3000);
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
          snackbar(error.response.data.msg, "error", 3000);
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
          snackbar(error.response.data.error, "error", 3000);
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  useEffect(() => {
    handleListUsers();
    handleAllRoles();
    handleAllBranches();
  }, []);

  useEffect(() => {
    handleListUsers();
  }, [selectedRoleName, selectedBranchName]);

  const handleDeleteUser = async () => {
    try {
      console.log("Delete");
    } catch (error) {
      console.error(error);
    }

    setUserDeleteModalOpen(false);
  };

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
                  header={["Name", "Email", "Branches", "Role"]}
                  onChangeData={(page, show) => () => {
                    handleListUsers(page, show);
                  }}
                >
                  {users?.list?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          component={"img"}
                          src={
                            item.gender === "Male"
                              ? "/assets/man.png"
                              : "/assets/woman.png"
                          }
                          alt={item.gender}
                          width={32}
                          mr={1}
                        />
                        <Tooltip title="View Details" placement="right">
                          <Button
                            variant="text"
                            onClick={() => {
                              setUserDetailsModalOpen(true);
                              setSelectedUser(item);
                            }}
                            className="open-details"
                          >
                            {item.first_name} {item.last_name}
                          </Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {JSON.parse(item.all_branches)
                          ?.map((item) => item.name)
                          .join(", ")}
                      </TableCell>
                      <TableCell>{item.role_name}</TableCell>
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
        <Paper elevation={4} className="modal-holder modal-holder-lg">
          <Box className="modal-header">
            <Typography>User Details</Typography>
            <IconButton onClick={() => setUserDetailsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box className="modal-body">
            {selectedUser && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }} textAlign={"right"}>
                  <Button
                    component={Link}
                    to={`/users/${selectedUser.id}`}
                    variant="contained"
                    color="blue"
                    className="mui-btn mui-btn-edit"
                  >
                    Edit Details
                  </Button>
                  <Button variant="contained" color="red">
                    Delete User
                  </Button>
                </Grid>
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
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
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
        <Paper elevation={4} className="modal-holder modal-holder-sm">
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
