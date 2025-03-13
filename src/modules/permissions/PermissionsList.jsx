import React, { useContext, useState } from "react";
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
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Permissions.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "@/components/tables/TableDefault";

import PermissionService from "@/services/PermissionService";

export default function PermissionsList() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [permissions, setPermissions] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [selectedPermission, setSelectedPermission] = useState({});

  const [permissionDeleteModalOpen, setPermissionDeleteModalOpen] =
    useState(false);

  const handleListPermissions = (last, direction, show, find) => {
    PermissionService.list(
      {
        last: last || moment().format("YYYYMMDDHHmmss"),
        direction: direction || "next",
        show: show || 5,
        find: find || "",
      },
      authUser?.token
    )
      .then((response) => {
        setPermissions(response.data.permissions);
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

  const handleDeletePermission = () => {};

  return (
    <React.Fragment>
      <Helmet>
        <title>Permissions | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="permissions-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Permissions
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  component={Link}
                  to="/permissions/create"
                  variant="contained"
                >
                  Add New Permission
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={false}
                  data={permissions}
                  tableName="permissions"
                  header={["Name", "Description", "Actions"]}
                  onChangeData={(last, direction, show, find) =>
                    handleListPermissions(last, direction, show, find)
                  }
                >
                  {permissions?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Typography>{item.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{item.description}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            component={Link}
                            to={`/permissions/${item.id}`}
                          >
                            <EditIcon color="blue" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedPermission(item);
                              setPermissionDeleteModalOpen(true);
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
        open={permissionDeleteModalOpen}
        onClose={() => setPermissionDeleteModalOpen(false)}
        className="user-roles-delete-modal"
      >
        <Paper elevation={4} className="modal-holder">
          <Box className="modal-header">
            <Typography>Delete Permission</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="are-you-sure">Are you sure?</Typography>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setPermissionDeleteModalOpen(false)}
              className="mui-btn mui-btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={() => handleDeletePermission()}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
