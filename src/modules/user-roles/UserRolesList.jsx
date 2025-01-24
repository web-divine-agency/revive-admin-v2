import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import DataTable from "react-data-table-component";

import { useLoader } from "@/components/loaders/LoaderContext";

import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import "./UserRoles.scss";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

export default function UserRolesList() {
  const navigate = useNavigate();
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const { setLoading } = useLoader();

  const [seletectedRoleId, setSelectedRoleId] = useState(0);

  const [userRolesDetailsModalOpen, setUserRolesDetailsModalOpen] =
    useState(false);
  const [userRolesDeleteModalOpen, setUserRolesDeleteModalOpen] =
    useState(false);

  // Get all roles
  useEffect(() => {
    setLoading(true);
    const fetchRoles = () => {
      try {
        const response = {};
        setRoles(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const fetchRoleDetails = () => {
    try {
      const response = {};
      const roleData = response.data;
      setSelectedUserRole({
        role_name: roleData.role_name,
        permissions: roleData.permissions,
      });
      setUserRolesDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching role details:", error);
    }
  };

  const handleDeleteUserRole = async () => {
    try {
      console.log("Delete");
    } catch (error) {
      console.error(error);
    }

    setUserRolesDeleteModalOpen(false);
    setRoles(roles.filter((role) => role.id !== seletectedRoleId));
  };
  const handleViewRoleDetails = (roleId) => {
    fetchRoleDetails(roleId);
  };

  // Table columns
  const columns = [
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
    },
    {
      name: "Role Description",
      selector: (row) => row.role_description,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <IconButton
            onClick={() => handleViewRoleDetails(row.id)}
            color="green"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(`/user-roles/${row.id}`)}
            color="blue"
          >
            <EditIcon />
          </IconButton>
          {row.role_name !== "Admin" && row.role_name !== "Staff" && (
            <IconButton
              onClick={() => {
                setSelectedRoleId(row.id);
                setUserRolesDeleteModalOpen(true);
              }}
              color="red"
            >
              <RemoveCircleIcon />
            </IconButton>
          )}
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>User Roles | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="user-roles-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            User Roles
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  component={Link}
                  to="/user-roles/create"
                  variant="contained"
                >
                  Add New Role
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DataTable
                  className="dataTables_wrapper"
                  columns={columns}
                  data={roles}
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 20]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}></Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Modal
        open={userRolesDetailsModalOpen}
        onClose={() => setUserRolesDetailsModalOpen(false)}
        className="user-roles-details-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-lg">
          <Box className="modal-header">
            <Typography>User Roles Details</Typography>
          </Box>
          <Box className="modal-body">
            {selectedUserRole && (
              <>
                <h2>{selectedUserRole.role_name} Permissions</h2>
                {selectedUserRole.permissions
                  .filter((permission) => {
                    return (
                      selectedUserRole.role_name !== "Admin" ||
                      permission.permission_name !== "Generate Ticket"
                    );
                  })
                  .map((permission, index) => (
                    <p key={index}>{permission.permission_name}</p>
                  ))}
              </>
            )}
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="grey"
              onClick={() => setUserRolesDetailsModalOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
      <Modal
        open={userRolesDeleteModalOpen}
        onClose={() => setUserRolesDeleteModalOpen(false)}
        className="user-roles-delete-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-sm">
          <Box className="modal-header">
            <Typography>Delete User Role</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="are-you-sure">Are you sure?</Typography>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setUserRolesDeleteModalOpen(false)}
              className="mui-btn mui-btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={() => handleDeleteUserRole()}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
