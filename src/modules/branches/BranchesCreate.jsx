import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import Global from "@/util/global";

import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import BranchService from "@/services/BranchService";

export default function BranchesCreate() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [branch, setBranch] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    city: "",
    state: "",
    country: "Australia",
    opening: "08:00:00",
    closing: "17:00:00",
  });

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

  const [errors, setErrors] = useState({});

  const handleError = (key) => {
    delete errors[key];
    setErrors((errors) => ({ ...errors }));
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBranch = (event) => {
    event.preventDefault();

    BranchService.create(
      {
        name: branch.name,
        address_line_1: branch.addressLine1,
        address_line_2: branch.addressLine2,
        zip_code: branch.zipCode,
        city: branch.city,
        state: branch.state,
        country: branch.country,
        opening: branch.opening,
        closing: branch.closing,
      },
      authUser?.token
    )
      .then(() => {
        navigate("/branches");
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          snackbar(error.response.data.msg, "error", 3000);
        } else if (error.response.status === 422) {
          setErrors(error.response.data.error);
          snackbar("Invalid input found", "error", 3000);
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Branches | Revive Pharmacy</title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="branches-create" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Add New Branch
          </Typography>
          <Paper variant="outlined">
            <form onSubmit={handleCreateBranch}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Branch name"
                    variant="outlined"
                    name="name"
                    value={branch.name}
                    onChange={(event) => handleOnChange(event)}
                    onClick={() => handleError("name")}
                    error={"name" in errors}
                    helperText={"name" in errors ? errors["name"] : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Address line 1"
                    variant="outlined"
                    name="addressLine1"
                    value={branch.addressLine1}
                    onChange={(event) => handleOnChange(event)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Address line 2"
                    variant="outlined"
                    name="addressLine2"
                    value={branch.addressLine2}
                    onChange={(event) => handleOnChange(event)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="City"
                    variant="outlined"
                    value={branch.city}
                    name="city"
                    onChange={(event) => handleOnChange(event)}
                    onClick={() => handleError("city")}
                    error={"city" in errors}
                    helperText={"city" in errors ? errors["city"] : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <FormControl fullWidth size="small" error={"state" in errors}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={branch.state}
                      name="state"
                      onChange={(event) => handleOnChange(event)}
                      label="State"
                    >
                      {australianStates.map((stateOption, index) => (
                        <MenuItem key={index} value={stateOption}>
                          {stateOption}
                        </MenuItem>
                      ))}
                    </Select>
                    {"state" in errors && (
                      <FormHelperText>{errors["gender"]}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Country"
                    variant="outlined"
                    value={branch.country}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Zip Code"
                    variant="outlined"
                    type="number"
                    name="zipCode"
                    value={branch.zipCode}
                    onChange={(event) => handleOnChange(event)}
                    onClick={() => handleError("zip_code")}
                    error={"zip_code" in errors}
                    helperText={"zip_code" in errors ? errors["zip_code"] : ""}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Opening Time"
                    variant="outlined"
                    type="time"
                    name="opening"
                    value={branch.opening}
                    onChange={(event) => handleOnChange(event)}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Closing Time"
                    variant="outlined"
                    type="time"
                    value={branch.closing}
                    name="closing"
                    onChange={(event) => handleOnChange(event)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    onClick={() => navigate("/branches")}
                    variant="contained"
                    color="black"
                    className="mui-btn mui-btn-cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Create
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
