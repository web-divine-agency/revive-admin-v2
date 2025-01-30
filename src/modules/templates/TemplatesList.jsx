import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

export default function TemplatesList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [filteredUsers, setFilteredUsers] = useState([]);
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

  useEffect(() => {
    // success login swal
    if (localStorage.getItem("loginSuccess") === "true") {
      localStorage.removeItem("loginSuccess");
    }
  }, []);

  useEffect(() => {
    const fetchUsers = () => {
      try {
        const response = {};
        setUsers(response.data);
        setFilteredUsers(response.data);

        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        // Do nothing
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
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
