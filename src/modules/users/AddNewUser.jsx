import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { FiChevronLeft } from "react-icons/fi";

import check from "../../../assets/images/check.png";

const animatedComponents = makeAnimated();

function AddNewUser() {
  const [last_name, setLastname] = useState("");
  const [first_name, setFirstname] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
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
    const fetchBranches = () => {
      try {
        const response = {};
        const options = response.data.map((branch) => ({
          value: branch.id,
          label: branch.branch_name,
        }));
        setBranchOptions(options);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();

    // Fetch roles
    const fetchRoles = () => {
      try {
        const response = {};
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const validateForm = () => {
    if (
      !last_name ||
      !first_name ||
      !selectedBranches.length ||
      !password ||
      !confirmPassword ||
      !email ||
      !sex ||
      !username ||
      !role_name
    ) {
      return "All fields are required.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
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

  const addUser = async (e) => {
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
      // setSuccessMessage("User added successfully!");
      setError("");
      setLastname("");
      setFirstname("");
      setSelectedBranches([]);
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setSex("");
      setUsername("");
      setRoleName("");
      Swal.fire({
        title: "User Added Successfully",
        text: `The user ${first_name} ${last_name} has been added.`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        // Redirect to user list
        navigate("/userlist");
      });
    } catch {
      setError("Failed to add user. Please try again.");
      // setSuccessMessage("");
    }
  };

  return (
    <div className="container">
      <a href="/userlist" className="back-btn">
        <h3 className="title-page">
          <FiChevronLeft className="icon-left" /> Add New User
        </h3>
      </a>

      <div className="container-content">
        <form onSubmit={addUser} className="add-user-form">
          <div
            style={{
              position: "relative",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {error && (
              <div
                className="alert alert-danger"
                style={{
                  position: "absolute",
                  left: "25%",
                  top: "-10px",
                  width: "50%",
                  padding: "4px",
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between ml-5 mr-5 pt-4 mt-3 add-user-fields">
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
          <div className="d-flex justify-content-between ml-5 mr-5 add-user-fields">
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
          <div className="d-flex justify-content-between ml-5 add-user-fields">
            <div
              className="form-group add-branch-select"
              style={{ width: "205px", height: "0" }}
            >
              <label>Branches:</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={branchOptions}
                value={selectedBranches}
                onChange={setSelectedBranches}
                menuPlacement="auto"
                menuPosition="fixed"
                styles={{
                  control: (provided, { isFocused }) => ({
                    ...provided,
                    maxHeight: "300px",
                    overflowY: "auto",
                    width: isFocused ? "310px" : "208px", // Default width is 200px; expands to 310px on focus
                    transition: "width 0.3s ease", // Smooth transition when width changes
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    right: "0",
                    transform: "translate(100%, 100%)",
                  }),
                }}
                menuPortalTarget={document.body}
              />
            </div>

            <div className="form-group role-field">
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

          <button className="submit-btn mb-4 mt-5" type="submit">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewUser;
