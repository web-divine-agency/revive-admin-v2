import React, { useState, useEffect } from "react";
import profile_avatar from "../../../assets/images/profile_avatar.png";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import close from "../../../assets/images/close.png";
import check from "../../../assets/images/check.png";

function MyProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Fetch current user details
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/user");
        const { username, email, first_name, last_name, roles, branch } = response.data;
        const role = roles.length > 0 ? roles[0].role_name : 'No Role';

        setUsername(username);
        setEmail(email);
        setFirstName(first_name);
        setLastName(last_name);
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
      Swal.fire({
        title: "Password Mismatch",
        text: "New password and confirm password do not match.",
        imageUrl: close,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#EC221F",
        customClass: {
          confirmButton: "custom-error-confirm-button",
          title: "custom-swal-title",
        },
      });
      return;
    }
    if (!oldPassword) {
      Swal.fire({
        title: 'Old Password Required',
        text: 'Please enter your old password before making changes.',
        imageUrl: close,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#EC221F",
        customClass: {
          confirmButton: "custom-error-confirm-button",
          title: "custom-swal-title",
        },
      });
      return;
    }

    try {
      await axiosInstance.put("/update-profile", {
        username,
        email,
        oldPassword,
        newPassword,
      });
      Swal.fire({
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
        customClass: {
          confirmButton: "custom-success-confirm-button",
          title: "custom-swal-title",
        },
      });
    } catch (error) {
      Swal.fire({
        title: 'Update Failed',
        text: error.response?.data?.message || 'Something went wrong. Please try again later.',
        imageUrl: close,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#EC221F",
        customClass: {
          confirmButton: "custom-error-confirm-button",
          title: "custom-swal-title",
        },
      });
    }
  };


  return (
    <div className="custom-profile-container">
      <div className="col-lg-12">
        <div className="row custom-row">
          <div className="col-lg-7" style={{ paddingLeft: "0px", marginLeft: "-20px" }}>
            <h3>Hello, {first_name} {last_name}!</h3>
            <p>This is your profile page, where you can customize your profile and change your password as needed</p>
          </div>
          <div className="col-lg-4">

          </div>
          <div className="col-lg-7 profile-update">
            <h2>User Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="d-flex justify-content-start">
                <div className="form-group mr-5">
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
            <form onSubmit={handleProfileUpdate}  >
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
              <button className="submit-btn" type="submit">Update Profile</button>
            </form>
          </div>
          <div className="col-lg-4 profile-user text-center">
            <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="130" height="130" rx="65" fill="#EADDFF" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M84.5008 52C84.5008 62.7696 75.7703 71.5 65.0008 71.5C54.2312 71.5 45.5008 62.7696 45.5008 52C45.5008 41.2304 54.2312 32.5 65.0008 32.5C75.7703 32.5 84.5008 41.2304 84.5008 52ZM78.0008 52C78.0008 59.1797 72.1805 65 65.0008 65C57.8211 65 52.0008 59.1797 52.0008 52C52.0008 44.8203 57.8211 39 65.0008 39C72.1805 39 78.0008 44.8203 78.0008 52Z" fill="#21005D" />
              <path d="M65.0008 81.25C43.959 81.25 26.0309 93.6923 19.2017 111.124C20.8653 112.776 22.6179 114.339 24.4515 115.804C29.5369 99.8 45.4901 87.75 65.0008 87.75C84.5115 87.75 100.465 99.8 105.55 115.804C107.384 114.339 109.136 112.776 110.8 111.124C103.971 93.6924 86.0426 81.25 65.0008 81.25Z" fill="#21005D" />
            </svg>

            <h5>{`${first_name} ${last_name}`}</h5>
            <h6>Role: {role}</h6>
            <h6>Branch: {branch}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
