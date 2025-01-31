import React from "react";
import { Helmet } from "react-helmet";

import { Box, Container, Typography } from "@mui/material";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

export default function TicketsList() {
  return (
    <React.Fragment>
      <Helmet>
        <title>Ticket List | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="users-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Account Management
          </Typography>
        </Container>
      </Box>
    </React.Fragment>
  );
}
