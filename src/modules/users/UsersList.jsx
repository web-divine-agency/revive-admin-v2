import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import DataTable from "react-data-table-component";

import {
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import "./Users.scss";

import { useLoader } from "@/components/loaders/LoaderContext";

import NavSidebar from "@/components/navigation/NavSidebar";
import NavTopbar from "@/components/navigation/NavTopbar";

import man from "@/assets/images/man.png";
import woman from "@/assets/images/woman.png";

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  const { setLoading } = useLoader();

  const [userDeleteModalOpen, setUserDeleteModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      localStorage.removeItem("loginSuccess");
    }
  }, []);

  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);
      try {
        const response = {};
        setUsers(response.data);
        setFilteredUsers(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = () => {
      try {
        const response = {};
        setRoles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, [navigate]);

  useEffect(() => {
    const fetchLoggedInUser = () => {
      try {
        const response = {}; // Adjust the endpoint if needed
        setLoggedInUser(response.data); // Assuming response contains user data
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchBranches = () => {
      try {
        const response = {};
        const formattedData = response.data.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }));
        setBranches(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchSelect = (e) => {
    setSelectedBranchId(e.target.value);
  };

  useEffect(() => {
    // Filter users whenever the filter or search state changes
    const applyFilters = () => {
      if (!loggedInUser) return;

      let tempUsers = users.filter((user) => user.id !== loggedInUser.id);

      if (roleFilter) {
        tempUsers = tempUsers.filter(
          (user) =>
            user.roles?.map((r) => r.role_name).join(", ") === roleFilter
        );
      }

      if (search) {
        tempUsers = tempUsers.filter((user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }

      if (selectedBranchId) {
        tempUsers = tempUsers.filter((user) =>
          user.branches?.some(
            (branch) => branch.id === parseInt(selectedBranchId)
          )
        );
      }

      setFilteredUsers(tempUsers);
    };

    applyFilters();
  }, [filter, roleFilter, search, users, loggedInUser, selectedBranchId]);

  const handleDeleteUser = async () => {
    try {
      console.log("Delete");
    } catch (error) {
      console.error(error);
    }

    setUserDeleteModalOpen(false);
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setFilteredUsers(
      filteredUsers.filter((user) => user.id !== selectedUser.id)
    );
  };

  const columns = [
    {
      name: "Name",
      width: "15%",
      sortable: true,
      selector: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            className="profile-image"
            src={row.sex === "Male" ? man : woman}
            alt={row.last_name}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "8px",
            }}
          />
          <span>
            {row.first_name} {row.last_name}
          </span>
        </div>
      ),
    },
    {
      name: "Email",
      width: "15%",
      sortable: true,
      selector: (row) => row.email || "N/A",
    },
    {
      name: "Branch",
      width: "40%",
      sortable: true,
      selector: (row) =>
        row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
    },
    {
      name: "Role",
      width: "10%",
      sortable: true,
      selector: (row) => row.roles?.map((r) => r.role_name).join(", ") || "N/A",
    },
    {
      name: "Actions",
      width: "20%",
      sortable: false,
      selector: (row) => (
        <div>
          <IconButton
            onClick={() => {
              setSelectedUser({
                id: row.id,
                name: `${row.first_name} ${row.last_name}`,
                email: row.email,
                username: row.username,
                branch:
                  row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
                role: row.roles?.map((r) => r.role_name).join(", ") || "N/A",
                profileImage: row.sex === "Male" ? man : woman,
              });
              setUserDetailsModalOpen(true);
            }}
            color="green"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/users/${row.id}`)} color="blue">
            <EditIcon />
          </IconButton>
          {loggedInUser && row.id !== loggedInUser.id && (
            <IconButton
              onClick={() => {
                setSelectedUser({
                  id: row.id,
                  name: `${row.first_name} ${row.last_name}`,
                  email: row.email,
                  username: row.username,
                  branch:
                    row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
                  role: row.roles?.map((r) => r.role_name).join(", ") || "N/A",
                  profileImage: row.sex === "Male" ? man : woman,
                });
                setUserDeleteModalOpen(true);
              }}
              color="red"
            >
              <RemoveCircleIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
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
                <div className="top-filter">
                  <select
                    name="filter"
                    className="filter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.role_name}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="filter"
                    className="filter"
                    value={selectedBranchId}
                    onChange={handleBranchSelect}
                  >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="search-bar"
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <div className="container-content">
                  <DataTable
                    className="dataTables_wrapper"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[20, 30]}
                    responsive
                  />
                </div>
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
          </Box>
          <Box className="modal-body">
            {selectedUser && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Box
                    component={"img"}
                    src={selectedUser.profileImage}
                    alt={selectedUser.name}
                    className="profile-image"
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          label="Name"
                          value={selectedUser.name}
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
                          value={selectedUser.role}
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
                          label="Branch"
                          value={selectedUser.branch}
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
              color="grey"
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
