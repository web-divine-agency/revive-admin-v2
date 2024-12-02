import React from "react";
import { Helmet } from "react-helmet";

import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./ResourcesIndex.scss";

import NavTopbar from "../../Navigation/nav-topbar/NavTopbar";
import NavSidebar from "../../Navigation/nav-sidebar/NavSidebar";

export default function ResourcesIndex() {
  // eslint-disable-next-line no-unused-vars
  const cards = [
    {
      title: "General",
      image: "",
    },
    {
      title: "Troubleshoot",
      image: "",
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
          <Grid container spacing={2}></Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
}
