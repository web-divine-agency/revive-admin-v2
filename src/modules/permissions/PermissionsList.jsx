import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

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

  // eslint-disable-next-line no-unused-vars
  const [permissionsDetailsModalOpen, setPermissionsDetailsModalOpen] =
    useState(false);

  const handleListPermissions = (page = 1, show = 10, find = "") => {
    PermissionService.list(
      { page: page, show: show, find: find },
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
                  header={["Name", "Description"]}
                  onChangeData={(page, show, find) => {
                    handleListPermissions(page, show, find);
                  }}
                >
                  {permissions?.list?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ width: "25%" }}>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableDefault>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
