import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import NavTopbar from "../../components/navigation/NavTopbar";
import NavSidebar from "../../components/navigation/NavSidebar";
import PermissionService from "../../services/PermissionService";
import Global from "../../util/global";
import { snackbar } from "../../util/helper";

export default function PermissionsCreate() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [permission, setPermission] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleError = (key) => {
    delete errors[key];
    setErrors((errors) => ({ ...errors }));
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setPermission((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePermission = () => {
    PermissionService.create(
      { name: permission.name, description: permission.description },
      authUser?.token
    )
      .then(() => {
        navigate("/permissions");
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else if (error.response.status === 422) {
          setErrors(error.response.data.error);
          snackbar("Invalid input found", "error", 3000);
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
      <Box component={"section"} id="user-roles-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Permissions
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Permissions
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  type="text"
                  name="name"
                  label="Name"
                  value={permission.name}
                  onChange={(event) => handleOnChange(event)}
                  onClick={() => handleError("name")}
                  error={"name" in errors}
                  helperText={"name" in errors ? errors["name"] : ""}
                  sx={{ minWidth: 256 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  multiline
                  size="small"
                  label="Description"
                  value={permission.description}
                  name="description"
                  onChange={(event) => handleOnChange(event)}
                  sx={{ minWidth: 256 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  onClick={() => handleCreatePermission()}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
