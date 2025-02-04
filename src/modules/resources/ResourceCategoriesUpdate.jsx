import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import "./Resources.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import ResourceService from "@/services/ResourceService";

export default function ResourceCategoriesUpdate() {
  const navigate = useNavigate();

  const { resourceCategoryId } = useParams();

  const { authUser } = useContext(Global);

  const [resourceCategory, setResourceCategory] = useState({
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
    setResourceCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleReadResourceCategory = () => {
    ResourceService.readCategory(resourceCategoryId, authUser?.token)
      .then(({ data }) => {
        setResourceCategory({
          name: data.resource_category.name,
          description: data.resource_category.description || "",
        });
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

  const handleUpdateResourceCategory = () => {
    ResourceService.updateCategory(
      resourceCategoryId,
      {
        name: resourceCategory.name,
        description: resourceCategory.description,
      },
      authUser?.token
    )
      .then(() => {
        navigate("/resource-categories");
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
    handleReadResourceCategory();
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box
        component={"section"}
        id="resource-categories-create"
        className="panel"
      >
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Create Resource Category
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Go Back
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  type="text"
                  name="name"
                  label="Name"
                  value={resourceCategory.name}
                  onChange={(event) => handleOnChange(event)}
                  onClick={() => handleError("name")}
                  error={"name" in errors}
                  helperText={"name" in errors ? errors["name"] : ""}
                  sx={{ minWidth: 384 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  multiline
                  rows={4}
                  size="small"
                  label="Description"
                  value={resourceCategory.description}
                  name="description"
                  onChange={(event) => handleOnChange(event)}
                  sx={{ minWidth: 384 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate("/resource-categories")}
                  variant="contained"
                  color="black"
                  className="mui-btn mui-btn-cancel"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdateResourceCategory}
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
