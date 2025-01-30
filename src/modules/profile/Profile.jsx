import { useState, useEffect } from "react";

import man from "@/assets/images/man.png";
import woman from "@/assets/images/woman.png";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sex, setSex] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Fetch current user details
    const fetchUserDetails = () => {
      try {
        const response = {};
        const { username, email, first_name, last_name, sex, roles, branch } =
          response.data;
        const role = roles.length > 0 ? roles[0].role_name : "No Role";

        setUsername(username);
        setEmail(email);
        setFirstName(first_name);
        setLastName(last_name);
        setSex(sex);
        setRole(role);
        setBranch(branch.join(", "));
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword && newPassword.length < 8) {
      return;
    }

    if (!oldPassword) {
      return;
    }

    try {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Do nothing
    }
  };

  return (
    <div className="custom-profile-container">
      <div className="col-lg-12">
        <div className="row custom-row">
          <div
            className="col-lg-7"
            style={{ paddingLeft: "0px", marginLeft: "-20px" }}
          >
            <h3>
              Hello, {first_name} {last_name}!
            </h3>
            <p>
              This is your profile page, where you can customize your profile
              and change your password as needed
            </p>
          </div>
          <div className="col-lg-4"></div>
          <div className="col-lg-7 profile-update pb-4">
            <h2>User Information</h2>
            <form onSubmit={handleProfileUpdate} className="user-info-form">
              <div className="d-flex justify-content-start user-info-fields">
                <div className="form-group mr-5 username-field">
                  <label>User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </form>
            <h2 className="mt-4">Change Password</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="">
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    className="form-control w-50"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your old password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control w-50"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control w-50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <button className="submit-btn" type="submit">
                Update Profile
              </button>
            </form>
          </div>
          <div className="col-lg-4 profile-user text-center">
            <img
              className="profile-image"
              src={sex === "Male" ? man : woman}
              style={{
                width: "40%",
                height: "100%",
                borderRadius: "50%",
              }}
            />
            <h5>{`${first_name} ${last_name}`}</h5>
            <h6>Role: {role}</h6>
            <h6>Branch: {branch}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
