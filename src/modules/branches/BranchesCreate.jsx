import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Swal from "sweetalert2";

import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import check from "@/assets/images/check.png";

export default function BranchesCreate() {
  const [branch, setBranch] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(""); // Changed to be a dropdown for Australian states
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Australia"); // Set default country to Australia
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [status, setStatus] = useState("Closed");

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // list of countries
  const australianStates = [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Tasmania",
    "Australian Capital Territory",
    "Northern Territory",
  ];

  const addBranch = (e) => {
    e.preventDefault();

    const branchAddress = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zipCode}, ${country}`;

    const operatingHours = {
      open: openTime,
      close: closeTime,
    };

    // eslint-disable-next-line no-unused-vars
    const newBranchData = {
      branch_name: branch,
      branch_address: branchAddress,
      operating_hours: operatingHours,
      status: status,
    };

    if (
      !branch ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !openTime ||
      !closeTime
    ) {
      snackbar("All fields are required", "error", 3000);
      return;
    }

    if (openTime >= closeTime) {
      setError(
        "Invalid operating hours. Open time should be before close time."
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setError("");
      setBranch("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setZipCode("");
      setCountry("");
      setOpenTime("");
      setCloseTime("");
      setStatus("");
      Swal.fire({
        title: "Branch Added Successfully",
        text: `${branch} has been added to the system.`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        navigate("/branches");
      });
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Branches | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="branches-create" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Add New Branch
          </Typography>
          <Paper variant="outlined">
            <form onSubmit={addBranch} className="add-branch-form">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Branch name"
                    variant="outlined"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Address line 1"
                    variant="outlined"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Address line 2"
                    variant="outlined"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Zip Code"
                    variant="outlined"
                    type="number"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="City"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      label="State"
                    >
                      <MenuItem value="">
                        <em>Select State</em>
                      </MenuItem>
                      {australianStates.map((stateOption, index) => (
                        <MenuItem key={index} value={stateOption}>
                          {stateOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Country"
                    variant="outlined"
                    value={country}
                    InputProps={{
                      readOnly: true, // Makes the field disabled
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="Closed">Closed</MenuItem>
                      <MenuItem value="Open">Open</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Opening Time"
                    variant="outlined"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true, // Ensures the label stays visible with type="time"
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Closing Time"
                    variant="outlined"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true, // Ensures the label stays visible for type="time"
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
