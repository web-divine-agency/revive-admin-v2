import { useContext } from "react";

import { Box, Container, Typography } from "@mui/material";

import Global from "@/util/global";

import "./Navigation.scss";

export default function NavTopbar() {
  const { authUser } = useContext(Global);

  return (
    <Box component={"nav"} id="nav-topbar">
      <Container maxWidth="false">
        <Box className="header">
          <Box className="profile-holder">
            <Box
              component={"img"}
              className="avatar"
              src={
                authUser?.gender === "Male"
                  ? "/assets/man.png"
                  : "/assets/woman.png"
              }
              alt="Profile"
            />
            <Box className="profile-info">
              <Typography className="name">
                {authUser?.first_name} {authUser?.last_name}
              </Typography>
              <Typography className="email">{authUser?.email} </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
