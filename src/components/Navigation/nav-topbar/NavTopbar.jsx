import { useEffect, useState } from "react";

import { Box, Container, Typography } from "@mui/material";

import "./NavTopbar.scss";

import axiosInstance from "../../../../axiosInstance";

export default function NavTopbar() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    email: "",
  });

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get("/user");

      setUser({
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        sex: response.data.sex,
        email: response.data.email,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <Box component={"nav"} id="nav-topbar">
      <Container maxWidth="false">
        <Box className="header">
          <Box className="profile-holder">
            <Box
              component={"img"}
              className="avatar"
              src={
                user.sex === "Male" ? "/assets/man.png" : "/assets/woman.png"
              }
              alt="Profile"
            />
            <Box className="profile-info">
              <Typography className="name">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography className="email">{user.email} </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
