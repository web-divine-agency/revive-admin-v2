import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";

import DataTable from "react-data-table-component";

import { Box, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./ActivityLogs.scss";

import { useLoader } from "@/components/loaders/LoaderContext";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import man from "@/assets/images/man.png";
import woman from "@/assets/images/woman.png";

export default function ActivityLogs() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [branchFilter, setBranchFilter] = useState(""); // New state for branch filter
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const { setLoading } = useLoader();

  useEffect(() => {
    const fetchLogs = () => {
      setLoading(true);
      try {
        const response = {};
        const formattedData = response.data.map((staff_logs) => ({
          id: staff_logs?.id,
          name: `${staff_logs?.user?.first_name || "N/A"} ${
            staff_logs?.user?.last_name || ""
          }`,
          sex: staff_logs?.user?.sex || "N/A",
          date: staff_logs?.createdAt
            ? new Date(staff_logs.createdAt).toLocaleString()
            : "N/A",
          role: staff_logs?.user?.roles?.[0]?.role_name || "N/A",
          branch:
            staff_logs?.user?.branches?.map((r) => r.branch_name).join(", ") ||
            "N/A",
          action:
            staff_logs?.action === "logout"
              ? "Logged Out"
              : staff_logs?.action === "login"
              ? "Logged In"
              : staff_logs?.action || "Unknown Action",
          // sex: staff_logs?.user?.sex || 'N/A'
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBranches = () => {
      try {
        const response = {};
        setBranches(response.data); // Assuming backend returns a list of branches
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchLogs();
    fetchBranches();
  }, [navigate]);

  const columns = [
    {
      name: "Name",
      selector: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            className="profile-image"
            src={row.sex === "Male" ? man : woman}
            alt={row.name}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          {row.name}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) =>
        moment(row.date.toLocaleString()).format("D MMM, YYYY | h:mm a"),
    },

    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: true,
    },
  ];

  useEffect(() => {
    const fetchLoggedInUser = () => {
      try {
        const response = {};
        setLoggedInUser(response.data);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
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

    fetchLoggedInUser();
    fetchRoles();
  }, []);

  const filteredData = data
    .filter((item) => {
      // Apply branch-based filtering
      if (roleFilter) {
        return item.role.includes(roleFilter); // Match branch name to selected branch
      }
      return true;
    })
    .filter((item) => {
      // Apply branch-based filtering
      if (branchFilter) {
        return item.branch.includes(branchFilter); // Match branch name to selected branch
      }
      return true;
    })
    .filter((item) => {
      // Apply search-based filtering
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <React.Fragment>
      <Helmet>
        <title>Activity Logs | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="staff-logs" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Activity Logs
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
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
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.branch_name}>
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
                  data={filteredData}
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20]}
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
