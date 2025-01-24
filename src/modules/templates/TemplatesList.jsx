import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

import { Modal } from "react-bootstrap";
import { useLoader } from "@/components/loaders/LoaderContext";

import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import man from "@/assets/images/man.png";
import woman from "@/assets/images/woman.png";
import check from "@/assets/images/check.png";

export default function TemplatesList() {
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

  // eslint-disable-next-line no-unused-vars
  const [ticketTypes, setTicketTypes] = useState([]);

  const { setLoading } = useLoader();
  useEffect(() => {
    // success login swal
    if (localStorage.getItem("loginSuccess") === "true") {
      Swal.fire({
        title: "Login Successful",
        text: `Welcome`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      });

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
      } catch (e) {
        console.error(e);
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
    const fetchTicketTypes = async () => {
      try {
        const response = {};
        const formattedData = response.data.map((ticket_type) => ({
          id: ticket_type.id,
          ticket_type: ticket_type.ticket_type,
        }));
        setTicketTypes(formattedData);
        //console.log(ticketTypes);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }
    };
    fetchTicketTypes();
  }, []);

  useEffect(() => {
    // Filter users whenever the filter or search state changes
    const applyFilters = () => {
      if (!loggedInUser) return;

      let tempUsers = users.filter(
        (user) =>
          user.id !== loggedInUser.id &&
          user.roles?.map((r) => r.role_name).join(", ") !== "Admin"
      );

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

  const handleEditAccessClick = (userId) => {
    navigate(`/template-access/${userId}`);
  };

  const columns = [
    {
      name: "Name",
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
          {row.first_name} {row.last_name}
        </div>
      ),
      sortable: true,
    },
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
      selector: (row) => row.roles?.map((r) => r.role_name).join(", ") || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div>
          <IconButton
            onClick={() =>
              handleViewClick({
                name: `${row.first_name} ${row.last_name}`,
                profileImage: row.sex === "Male" ? man : woman,
                ticket_type:
                  row.ticketTypes?.map((r) => r.ticket_type).join(", ") ||
                  "Default",
              })
            }
            color="green"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => handleEditAccessClick(row.id)}
            color="blue"
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>Template Access | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="tickets-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Template Access
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Generate Tickets
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
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
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DataTable
                  className="dataTables_wrapper"
                  columns={columns}
                  data={filteredUsers}
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                {selectedUser && (
                  <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="profile-container">
                        <div className="profile-image">
                          <img
                            src={selectedUser.profileImage}
                            alt={selectedUser.name}
                            style={{
                              width: "170px",
                              height: "auto",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <center>
                            {" "}
                            <h2> {selectedUser.name} </h2>
                          </center>
                        </div>

                        <div className="ticketTypeListContainer">
                          <p> Allowed Templates: </p>
                          <h5>
                            {selectedUser.ticket_type
                              .split(",")
                              .map((type, index) => (
                                <p className="allowedTickets" key={index}>
                                  {type.trim()}
                                </p>
                              ))}
                          </h5>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
