import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import "./Auth.scss";

import AuthService from "@/services/AuthService";
import Global from "@/util/global";

import { snackbar } from "@/util/helper";

export default function Login() {
  const navigate = useNavigate();

  const { setAuthUser } = useContext(Global);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  const handleError = (key) => {
    delete errors[key];
    setErrors((errors) => ({ ...errors }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    AuthService.login(user)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setAuthUser(response.data.user);

        if (response.data.user.role_name === "Admin") {
          navigate("/users");
        } else {
          navigate("/tickets-list");
        }
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          snackbar(error.response.data.error, "error", 3000);
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
        <title>Login | Revive Pharmacy </title>
      </Helmet>
      <Box component={"section"} id="login">
        <Box className="left-panel">
          <Box className="green-circle" />
          <Box
            component={"img"}
            src="/assets/login-image.png"
            alt="Login Image"
            className="login-image"
          />
        </Box>
        <Box className="right-panel">
          <Box className="login-holder">
            <Box className="login-form">
              <Typography className="section-title">
                Revive&nbsp;Pharmacy&nbsp;Portal
              </Typography>
              <Typography mb={2}>
                Welcome back! Login to your account
              </Typography>

              <Box component={"form"} onSubmit={handleLogin}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      variant="outlined"
                      label="Username"
                      name="username"
                      value={user.username}
                      onChange={(event) => handleOnChange(event)}
                      onClick={() => handleError("username")}
                      error={"username" in errors}
                      helperText={
                        "username" in errors ? errors["username"] : ""
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl
                      fullWidth
                      size="small"
                      variant="outlined"
                      error={"password" in errors}
                    >
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        name="password"
                        value={user.password}
                        onChange={(event) => handleOnChange(event)}
                        onClick={() => handleError("password")}
                        onKeyUp={({ code }) => {
                          if (code === "Enter" || code === "NumpadEnter") {
                            handleLogin();
                          }
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {"password" in errors && (
                        <FormHelperText>{errors["password"]}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: 128 }}
                    >
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
