import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import "./Auth.scss";

import AuthService from "@/services/AuthService";
import Global from "@/util/global";

import login_image_2 from "@/assets/images/login_image_2.png";
import { snackbar } from "../../util/helper";

function Login() {
  const navigate = useNavigate();

  const { setAuthUser } = useContext(Global);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("Staff");
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
        navigate("/users");
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
    <div className="d-flex align-items-center justify-content-center custom-login">
      <div className="row">
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center custom-col">
          <div className="header-title">
            <h1>
              Welcome to Revive <br /> Pharmacy Portal
            </h1>
            <br />
          </div>
          <div className="bg-image">
            <img
              className="img-fluid login_image"
              src={login_image_2}
              alt="Login"
            />
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card p-4 login-form-wrap" style={{ width: "450px" }}>
            <h2 className="text-left mb-4">
              {selectedRole === "Staff" ? "Staff Login" : "Admin Login"}
            </h2>
            <form onSubmit={handleLogin}>
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
                    helperText={"username" in errors ? errors["username"] : ""}
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <FormControl>
                      <InputLabel id="role-select-label">Role</InputLabel>
                      <Select
                        size="small"
                        labelId="role-select-label"
                        id="role-select"
                        value={selectedRole}
                        label="Role"
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <MenuItem value={"Staff"}>Staff</MenuItem>
                        <MenuItem value={"Admin"}>Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" sx={{ width: 128 }}>
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
