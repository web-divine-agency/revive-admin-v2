import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Box, Button, Container, Paper, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import NavTopbar from "../../components/navigation/NavTopbar";
import NavSidebar from "../../components/navigation/NavSidebar";
import TableDefault from "../../components/tables/TableDefault";

export default function PermissionsList() {
  // eslint-disable-next-line no-unused-vars
  const [permissionsDetailsModalOpen, setPermissionsDetailsModalOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [selectedPermission, setSelectedPermission] = useState({})

  // eslint-disable-next-line no-unused-vars
  const handleListPermissions = (page = 1, show = 10, find = "") => {};

  return (
    <React.Fragment>
      <Helmet>
        <title>Permissions | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="user-roles-list" className="panel">
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
                  data={[]}
                  tableName="roles"
                  header={["Name", "Description"]}
                  onChangeData={(page, show, find) => {
                    handleListPermissions(page, show, find);
                  }}
                >
                  {[].list?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Tooltip title="View Details" placement="right">
                          <Button
                            variant="text"
                            onClick={() => {
                              setPermissionsDetailsModalOpen(true);
                              setSelectedPermission(item);
                            }}
                            className="open-details"
                          >
                            {item.name}
                          </Button>
                        </Tooltip>
                      </TableCell>
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
