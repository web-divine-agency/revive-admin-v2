import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./ResourcesIndex.scss";

import NavTopbar from "../../Navigation/nav-topbar/NavTopbar";
import NavSidebar from "../../Navigation/nav-sidebar/NavSidebar";

export default function ResourcesIndex() {
  const cards = [
    {
      title: "General",
      image: "",
      category: "General Resource",
    },
    {
      title: "Troubleshoot",
      image: "",
      category: "Troubleshooting Resource",
    },
    {
      title: "Category 1",
      image: "",
      category: "Category 1",
    },
    {
      title: "Category 2",
      image: "",
      category: "Category 2",
    },
  ];

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
              {cards.map((item, i) => (
                <Grid size={{ xs: 12, lg: 4 }} key={i}>
                  <Card
                    component={Link}
                    to={`/resources?category=${item.category}`}
                  >
                    <CardContent>
                      <Typography className="card-title">
                        {item.title}
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
