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

export default function ResourcesIndex() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [resources, setResources] = useState([]);

  const handleListResources = () => {
    ResourceService.list({}, authUser?.token)
      .get("/all-resources")
      .then((response) => {
        let data = response.data.resource_data;

        // Handle duplicates
        let r = data.filter((item, i) => {
          if (i !== data.length && item.category !== data[i + 1]?.category) {
            return item;
          }
        });

        setResources(r);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    handleListResources();
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
            Resource Categories
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
              {resources.map((item, i) => (
                <Grid size={{ xs: 12, lg: 4 }} key={i}>
                  <Card
                    component={Link}
                    to={`/resources?category=${item.category}`}
                  >
                    <CardContent>
                      <Typography className="card-title">
                        {item.category}
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
