import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import Swal from "sweetalert2";

import { snackbar } from "@/util/helper";
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

import NavTopbar from "../../components/navigation/NavTopbar";
import NavSidebar from "../../components/navigation/NavSidebar";

import check from "@/assets/images/check.png";

export default function BranchesUpdate() {
  const { branchId } = useParams();
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

  //assuming these are th data from database
  useEffect(() => {
    // Fetch branches
    const fetchBranches = () => {
      try {
        const response = {};
        const { branch_name, branch_address, operating_hours, status } =
          response.data;
        const parsedOperatingHours = JSON.parse(operating_hours);
        setOpenTime(parsedOperatingHours.open);
        setCloseTime(parsedOperatingHours.close);
        setBranch(branch_name);
        const addressParts = branch_address.split(", ");
        setAddressLine1(addressParts[0]);
        setAddressLine2(addressParts[1]);
        setCity(addressParts[2]);
        setState(addressParts[3]);
        setZipCode(addressParts[4]);
        setCountry(addressParts[5]);
        setCountry("Australia");
        setStatus(status);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, [branchId]);

  const updateBranch = async (e) => {
    e.preventDefault();

    const branchAddress = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zipCode}, ${country}`;

    const operatingHours = {
      open: openTime,
      close: closeTime,
    };

    // eslint-disable-next-line no-unused-vars
    const updatedBranchData = {
      branch_name: branch,
      branch_address: branchAddress,
      operating_hours: operatingHours,
      status: status,
    };
    //add validation
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
      Swal.fire({
        title: "Branch Updated Successfully",
        text: `${branch} has been updated in the system.`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        navigate("/branches");
      });
    } catch (error) {
      console.error("Error updating branch:", error);
      setError("An error occurred while updating the branch.");
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
            Update {branch} Branch
          </Typography>
          <Paper variant="outlined">
            <form onSubmit={updateBranch}>
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
