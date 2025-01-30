import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./UserRoles.scss";

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";
import PermissionService from "../../services/PermissionService";
import Global from "../../util/global";
import { snackbar } from "../../util/helper";
import RoleService from "../../services/RoleService";

export default function UserRolesUpdate() {
  const navigate = useNavigate();

  const { roleId } = useParams();

  const { authUser } = useContext(Global);

  const [role, setRole] = useState({
    id: 0,
    name: "",
    description: "",
  });

  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [errors, setErrors] = useState({});

  const handleError = (key) => {
    delete errors[key];
    setErrors((errors) => ({ ...errors }));
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    // Convert `value` to a number since `item.id` is a number
    const numericValue = Number(value);

    setSelectedPermissions((prev) =>
      checked
        ? [...prev, numericValue]
        : prev.filter((val) => val !== numericValue)
    );
  };

  useEffect(() => {
    console.log(selectedPermissions);
  }, [selectedPermissions]);

  const handleAllPermissions = () => {
    PermissionService.all(authUser?.token)
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

  const handleReadUserRole = () => {
    RoleService.read(roleId, authUser?.token)
      .then(({ data }) => {
        setRole({
          id: data.role.role_id,
          name: data.role.role_name,
          description: data.role.role_description,
        });

        let permissionIds = JSON.parse(data.role.all_permissions)?.map(
          (item) => item.id
        );

        setSelectedPermissions(permissionIds);
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

  const handleUpdateUserRole = () => {
    RoleService.update(
      roleId,
      {
        name: role.name,
        description: role.description,
        permission_ids: selectedPermissions,
      },
      authUser?.token
    )
      .then(() => {
        navigate("/user-roles");
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

  useEffect(() => {
    handleReadUserRole();
    handleAllPermissions();
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>User Roles | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="user-roles-update" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Update User Roles
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  User Roles
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  type="text"
                  name="name"
                  label="Name"
                  value={role.name}
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
                  value={role.description}
                  name="description"
                  onChange={(event) => handleOnChange(event)}
                  sx={{ minWidth: 256 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography className="section-heading">
                  Permissions{" "}
                  {"permission_ids" in errors && (
                    <Chip label="required" color="red" />
                  )}
                </Typography>
                <FormGroup>
                  {permissions?.map((item, i) => (
                    <FormControlLabel
                      key={i}
                      control={
                        <Checkbox
                          value={item.id}
                          checked={selectedPermissions.includes(item.id)}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={item.name}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  onClick={() => handleUpdateUserRole()}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
