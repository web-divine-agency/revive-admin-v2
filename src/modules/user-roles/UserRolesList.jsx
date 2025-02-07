import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";

import {
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Paper,
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

import "./UserRoles.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "@/components/tables/TableDefault";

import RoleService from "@/services/RoleService";

export default function UserRolesList() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [roles, setRoles] = useState([]);

  const [selectedUserRole, setSelectedUserRole] = useState({});

  const [userRolesDetailsModalOpen, setUserRolesDetailsModalOpen] =
    useState(false);
  const [userRolesDeleteModalOpen, setUserRolesDeleteModalOpen] =
    useState(false);

  const handleListUserRoles = (last, direction, show, find) => {
    RoleService.list(
      {
        last: last || moment().format("YYYYMMDDhhmmss"),
        direction: direction || "next",
        show: show || 5,
        find: find || "",
      },
      authUser?.token
    )
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

  const handleDeleteUserRole = () => {
    RoleService.delete(selectedUserRole.role_id, authUser?.token)
      .then(() => {
        setUserRolesDeleteModalOpen(false);
        handleListUserRoles();
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
    handleListUserRoles();
  }, []);

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
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={false}
                  data={roles}
                  tableName="roles"
                  header={["Name", "Description", "Actions"]}
                  onChangeData={(last, direction, show, find) => {
                    handleListUserRoles(last, direction, show, find);
                  }}
                >
                  {roles?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Typography>{item.role_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{item.role_description}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedUserRole(item);
                              setUserRolesDetailsModalOpen(true);
                            }}
                          >
                            <VisibilityIcon color="green" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            component={Link}
                            to={`/user-roles/${item.role_id}`}
                          >
                            <EditIcon color="blue" />
                          </IconButton>
                        </Tooltip>
                        {item.role_name !== "Admin" &&
                          item.role_name !== "Staff" && (
                            <Tooltip title="Delete" placement="top">
                              <IconButton
                                onClick={() => {
                                  setSelectedUserRole(item);
                                  setUserRolesDeleteModalOpen(true);
                                }}
                              >
                                <DeleteIcon color="red" />
                              </IconButton>
                            </Tooltip>
                          )}
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
        open={userRolesDetailsModalOpen}
        onClose={() => setUserRolesDetailsModalOpen(false)}
        className="user-roles-details-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-lg">
          <Box className="modal-header">
            <Typography>User Roles Details</Typography>
            <IconButton onClick={() => setUserRolesDetailsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box className="modal-body">
            <Grid container spacing={2}>
              <Grid size={{ xs: 5 }}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Role name"
                        value={selectedUserRole?.role_name}
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={4}
                        label="Role description"
                        value={selectedUserRole?.role_description}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ minWidth: 256 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={{ xs: 7 }}>
                <Box>
                  <Typography sx={{ mb: 1, fontSize: 24 }}>
                    Permisisons
                  </Typography>
                  {selectedUserRole?.all_permissions &&
                    JSON.parse(selectedUserRole?.all_permissions)?.map(
                      (item, i) => (
                        <Typography key={i}>{`${i + 1}. ${
                          item.name
                        }`}</Typography>
                      )
                    )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="black"
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
