import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./UserRoles.scss";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import RoleService from "../../services/RoleService";
import Global from "../../util/global";
import { snackbar } from "../../util/helper";
import TableDefault from "../../components/tables/TableDefault";

export default function UserRolesList() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [roles, setRoles] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  const [userRolesDetailsModalOpen, setUserRolesDetailsModalOpen] =
    useState(false);
  const [userRolesDeleteModalOpen, setUserRolesDeleteModalOpen] =
    useState(false);

  const handleDeleteUserRole = () => {};

  const handleListUserRoles = (page = 1, show = 10) => {
    RoleService.list({ page: page, show: show }, authUser?.token)
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
                  header={["Name", "Description"]}
                  onChangeData={(page, show, find) => {
                    handleListUserRoles(page, show, find);
                  }}
                >
                  {roles?.list?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Tooltip title="View Details" placement="right">
                          <Button
                            variant="text"
                            onClick={() => {
                              setUserRolesDetailsModalOpen(true);
                              setSelectedUserRole(item);
                            }}
                            className="open-details"
                          >
                            {item.role_name}
                          </Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{item.role_description}</TableCell>
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
          </Box>
          <Box className="modal-body"></Box>
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
