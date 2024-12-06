import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import login_image_2 from "../../assets/images/login_image_2.png";
import axiosInstance from "../../../axiosInstance.js";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Staff");
  const [showPassword, setShowPassword] = useState(false);
  // const [branches, setBranches] = useState([]);
  // const [selectedBranch, setSelectedBranch] = useState('Main');
  const [error, setError] = useState({ value: "", isShow: false });
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        username,
        password,
      });

      // eslint-disable-next-line no-unused-vars
      const { user, accessToken, refreshToken, roleName } = response.data;
      // console.log("User ID:", user.id);
      if (selectedRole !== roleName) {
        // setError(`You cannot log in as ${selectedRole}. Your account role is ${userRole}.`);

        setError({
          value: "Invalid login, Please check your credentials",
          isShow: true,
        });

        return;
      }

      document.cookie = `role_name=${roleName}; Path=/;`;
      document.cookie = `accessToken=${accessToken}; Path=/;`;
      document.cookie = `refreshToken=${refreshToken}; Path=/; `;

      localStorage.setItem("loginSuccess", "true");
      if (roleName === "Admin") {
        navigate("/users");
      } else {
        navigate("/generate-tickets");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError({
        value: "Invalid login ,Please check your credentials ",
        isShow: true,
      });

      return;
    }
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
            {error.value !== "" && error.isShow === true && (
              <div className="alert alert-danger">
                {error.value}
                <div
                  className={"close-quick-alert"}
                  onClick={() => setError({ ...error, isShow: false })}
                ></div>
              </div>
            )}
            <form onSubmit={login}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    size="small"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div className="form-group group-field-password">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />{" "}
                &nbsp;
                <label htmlFor="showPassword">Show Password</label>
                <a
                  style={{ cursor: "pointer" }}
                  className="float-end"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="d-flex">
                {/* <div className="d-flex mb-3 mr-3">
                                    <h6>
                                        <select
                                            id="branch"
                                            className="form-control-sm"
                                            value={selectedBranch}
                                            onChange={(e) => setSelectedBranch(e.target.value)}
                                        >
                                            <option value="">Branch</option>
                                            {branches.map((branch) => (
                                                <option key={branch.id} value={branch.branch_name}>
                                                    {branch.branch_name}
                                                </option>
                                            ))}
                                        </select>
                                    </h6>
                                </div> */}
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
                  <Button type="submit" variant="contained" sx={{ width: 128 }}>
                    Login
                  </Button>
                </Box>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
