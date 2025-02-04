import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./Resources.scss";

import Global from "@/util/global";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import ResourceService from "@/services/ResourceService";
import { snackbar } from "../../util/helper";

export default function ResourcesIndex() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [resourceCategories, setResourceCategories] = useState([]);

  const handleAllResourceCategories = () => {
    ResourceService.allCategories(authUser?.token)
      .then((response) => {
        setResourceCategories(response.data.resource_categories);
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
    handleAllResourceCategories();
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="resources-index" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Resources
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/resources/create")}
                >
                  Add New Resource
                </Button>
              </Grid>
              {resourceCategories?.map((item, i) => (
                <Grid size={{ xs: 12, lg: 4 }} key={i}>
                  <Card
                    component={Link}
                    to={`/resources?category_id=${item.id}&category_name=${item.name}`}
                  >
                    <CardContent>
                      <Typography className="card-title">
                        {item.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
