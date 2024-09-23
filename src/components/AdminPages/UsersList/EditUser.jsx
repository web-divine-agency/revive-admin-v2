import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import check from "../../../assets/images/check.png";

function EditUser() {
  const { userId } = useParams();
  const [last_name, setLastname] = useState("");
  const [first_name, setFirstname] = useState("");
  const [branch_id, setBranch] = useState("");
  const [branch, setBranches] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role_name, setRoleName] = useState("");
  const [role, setRoles] = useState([]);
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch branches
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();

    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();

    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(`/user/${userId}`);
          const userData = response.data;
          setLastname(userData.last_name);
          setFirstname(userData.first_name);
          setBranch(userData.branch_id);
          setConfirmPassword(userData.password);
          setEmail(userData.email);
          setPassword(userData.password);
          setSex(userData.sex);
          setUsername(userData.username);
          setRoleName(userData.role_name);
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error.response ? error.response.data : error.message
          );
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const validateForm = () => {
    if (
      !last_name ||
      !first_name ||
      !branch_id ||
      !password ||
      !confirmPassword ||
      !email ||
      !sex ||
      !username ||
      !role_name
    ) {
      return "All fields are required.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Invalid email format.";
    }
    return "";
  };

  const editUser = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setTimeout(() => {
        setError("");
      }, 3000);
  
      return;
    }
  

    try {
      const response = await axiosInstance.put(`/update-user/${userId}`, {
        last_name,
        first_name,
        branch_id,
        password,
        email,
        sex,
        username,
        role_name,
      });

      // setSuccessMessage("User added successfully!");
      setError("");
      setLastname("");
      setFirstname("");
      setBranch("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setSex("");
      setUsername("");
      setRoleName("");
      Swal.fire({
        title: "User Updated Successfully",
        text: `The user ${first_name} ${last_name} has been Updated.`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        // Redirect to user list
        navigate("/userlist");
      });
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response && error.response.data
          ? error.response.data.message ||
          "Failed to add user. Please try again."
          : "Failed to add user. Please try again."
      );
      // setSuccessMessage("");
    }
  };

  return (
    <div className="container">
      <h3>Add New User</h3>
      <div className="container-content">
        <form onSubmit={editUser}>
          <div style={{ position: "relative", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
            {error && <div className="alert alert-danger" style={{ position: "absolute", left: "25%", top: "-10px", width: "50%", padding: "4px" }}>{error}</div>}
          </div>

          <div className="d-flex justify-content-between ml-5 mr-5 pt-4 mt-3">
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                className="form-control"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                className="form-control"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Sex:</label>
              <br />
              <select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between ml-5 mr-5">
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between ml-5">
            <div className="form-group">
              <label>Branch:</label>
              <br />
              <select
                value={branch_id}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">Select Branch</option>
                {branch.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Role:</label>
              <br />
              <select
                value={role_name}
                onChange={(e) => setRoleName(e.target.value)}
              >
                <option value="">Select Role</option>
                {role.map((role) => (
                  <option key={role.id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mr-5">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button className="submit-btn mb-4 mt-4" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
