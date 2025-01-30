import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Box, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./ActivityLogs.scss";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

export default function ActivityLogs() {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Helmet>
        <title>Activity Logs | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="activity-logs" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Activity Logs
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
