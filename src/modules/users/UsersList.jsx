import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import view_icon from "@/assets/images/view-details.png";
import edit_icon from "@/assets/images/edit-details.png";
import delete_icon from "@/assets/images/delete-log.png";

import man from "@/assets/images/man.png";
import woman from "@/assets/images/woman.png";
import check from "@/assets/images/check.png";

import { useLoader } from "@/components/loaders/LoaderContext";
import axiosInstance from "@/services/axiosInstance.js";

import "./Users.scss";

import NavSidebar from "@/components/navigation/NavSidebar";
import NavTopbar from "@/components/navigation/NavTopbar";

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  const { setLoading } = useLoader();
  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      localStorage.removeItem("loginSuccess");
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        setRoles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, [navigate]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await axiosInstance.get("/user"); // Adjust the endpoint if needed
        setLoggedInUser(response.data); // Assuming response contains user data
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/branches");
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

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteUserClick = async (userId) => {
    if (loggedInUser && userId === loggedInUser.id) {
      Swal.fire({
        icon: "error",
        title: "Cannot Delete Your Own Account",
        text: "You cannot delete your own account.",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      icon: "warning",
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#00000000",
      cancelTextColor: "#000000",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: "custom-container",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-swal-title",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-user/${userId}`);
          setUsers(users.filter((user) => user.id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
          Swal.fire({
            title: "Success!",
            text: "User has been deleted.",
            imageUrl: check,
            imageWidth: 100,
            imageHeight: 100,
            confirmButtonText: "OK",
            confirmButtonColor: "#0ABAA6",
            customClass: {
              confirmButton: "custom-success-confirm-button",
              title: "custom-swal-title",
            },
          });
        } catch {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the user.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#EC221F",
            customClass: {
              confirmButton: "custom-error-confirm-button",
              title: "custom-swal-title",
            },
          });
        }
      }
    });
  };

  const columns = [
    {
      name: "Name",
      width: "30%",
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
              marginRight: "10px",
            }}
          />

          <div className="user-details">
            <span>
              {" "}
              {row.first_name} {row.last_name}
            </span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
    },
    // {
    //   name: "Username",
    //   selector: (row) => row.username || "N/A",
    //   sortable: true,
    // },
    {
      name: "Branch",
      selector: (row) =>
        row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
      sortable: true,
      style: {
        width: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },

    {
      name: "Role",
      width: "15%",
      selector: (row) => row.roles?.map((r) => r.role_name).join(", ") || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      width: "15%",
      selector: (row) => (
        <div>
          <img
            src={view_icon}
            title="View User Details"
            alt="view"
            width="20"
            height="20"
            onClick={() =>
              handleViewClick({
                name: `${row.first_name} ${row.last_name}`,
                email: row.email,
                username: row.username,
                branch:
                  row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
                role: row.roles?.map((r) => r.role_name).join(", ") || "N/A",
                profileImage: row.sex === "Male" ? man : woman,
              })
            }
            style={{ cursor: "pointer" }}
          />
          <img
            className="ml-2"
            src={edit_icon}
            title="Edit User Details"
            onClick={() => navigate(`/users/${row.id}`)}
            alt="edit"
            width="20"
            height="20"
            style={{ cursor: "pointer" }}
          />
          {loggedInUser && row.id !== loggedInUser.id && (
            <img
              className="ml-2"
              src={delete_icon}
              title="Delete User"
              alt="delete"
              width="20"
              height="20"
              onClick={() => handleDeleteUserClick(row.id)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      ),
      sortable: false,
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
      {selectedUser && (
        <Modal show={showModal} onHide={handleCloseModal} size="md">
          <Modal.Header closeButton>
            <Modal.Title>Acccount Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
        </Modal>
      )}
    </React.Fragment>
  );
}
