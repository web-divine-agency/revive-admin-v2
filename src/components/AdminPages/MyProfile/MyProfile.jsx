import React, { useState, useEffect } from "react";
import profile_avatar from "../../../assets/images/profile_avatar.png";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import close from "../../../assets/images/close.png";

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
          <div className="col-lg-7" style={{paddingLeft: "0px", marginLeft: "-20px"}}>
            <h3>Hello {first_name}</h3>
            <p>This is your profile page, where you can customize your profile and change your password as needed</p>
          </div>
          <div className="col-lg-4">
           
          </div>
          <div className="col-lg-7 profile-update">
            <h2>User Information</h2>
            <form onSubmit={handleProfileUpdate} className="ml-4">
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
            <form onSubmit={handleProfileUpdate} className="ml-4">
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
            <img src={profile_avatar} alt="Profile Avatar" className="profile-avatar" />
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
