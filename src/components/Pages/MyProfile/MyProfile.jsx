import React from "react";
import profile_avatar from "../../../assets/images/profile_avatar.png";

function MyProfile() {
  return (
    <>
      <div className="custom-profile-container">
        <div className="col-lg-12">
          <div className="row custom-row ">
            <div className="ml-5 pl-3">
              <h3>Hello Administrator</h3>
              <p>
                This is your profile page, where you have the ability to <br />
                cutomize your profile and change your password as needed
              </p>
            </div>
            <div className="col-lg-7 profile-update">
              <h2>User Information</h2>
              <form className="ml-4">
                <div className="d-flex justify-content-start">
                  <div className="form-group mr-5">
                    <label>User Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="form-group"></div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <button className="submit-btn" type="submit">
                  SUBMIT
                </button>
              </form>
              <h2 className="mt-4">Change Password</h2>
              <form className="ml-4">
                <div className="">
                  <div className="form-group">
                    <label>Old Password</label>
                    <input type="password" className="form-control w-50" />
                  </div>
                  <div className="form-group"></div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-control w-50" />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control w-50" />
                  </div>
                </div>
                <button className="submit-btn" type="submit">
                  SAVE
                </button>
              </form>
            </div>
            <div className="col-lg-4 profile-user text-center">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="33" height="33" rx="16.5" fill="#EADDFF" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M21.4502 13.2C21.4502 15.9338 19.234 18.15 16.5002 18.15C13.7664 18.15 11.5502 15.9338 11.5502 13.2C11.5502 10.4662 13.7664 8.25 16.5002 8.25C19.234 8.25 21.4502 10.4662 21.4502 13.2ZM19.8002 13.2C19.8002 15.0225 18.3227 16.5 16.5002 16.5C14.6777 16.5 13.2002 15.0225 13.2002 13.2C13.2002 11.3775 14.6777 9.9 16.5002 9.9C18.3227 9.9 19.8002 11.3775 19.8002 13.2Z"
                  fill="#21005D"
                />
                <path
                  d="M16.5002 20.625C11.1588 20.625 6.60785 23.7834 4.87427 28.2084C5.29658 28.6278 5.74146 29.0245 6.20691 29.3964C7.49783 25.3338 11.5475 22.275 16.5002 22.275C21.4529 22.275 25.5026 25.3339 26.7935 29.3965C27.259 29.0245 27.7038 28.6278 28.1261 28.2084C26.3926 23.7834 21.8416 20.625 16.5002 20.625Z"
                  fill="#21005D"
                />
              </svg>

              <h5>Administrator</h5>
              <h5>admin@gmail.com</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
