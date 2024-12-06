import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LogoutIcon from "@mui/icons-material/Logout";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import Global from "../../../util/global";

import "./NavSidebar.scss";
import { getCookie } from "../../Authentication/getCookie";
import moment from "moment/moment";

export default function NavSidebar() {
  const navigate = useNavigate();

  const { sidebarActive, setSidebarActive, setAuthUser } = useContext(Global);

  const [datetime, setDatetime] = useState({
    day: "",
    date: "",
    time: "",
  });

  const [role, setRole] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuthUser({});

    navigate("/login");
  };

  const insertClock = () => {
    setInterval(() => {
      setDatetime((datetime) => ({
        ...datetime,
        day: moment().format("dddd"),
        date: moment().format("D MMM YYYY"),
        time: moment().format("hh:mm:ss a"),
      }));
    }, 1000);
  };

  useEffect(() => {
    setRole(getCookie("role_name"));
    insertClock();
  }, []);

  return (
    <Paper
      elevation={4}
      component={"aside"}
      id="nav-sidebar"
      className={sidebarActive ? "active" : ""}
    >
      <IconButton
        onClick={() => setSidebarActive(!sidebarActive)}
        color="black"
        className="btn-menu"
      >
        {sidebarActive ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
      <Container maxWidth="false">
        <Box
          component={"img"}
          src={"/assets/revive-logo-white.png"}
          className="sidebar-logo"
          alt="Revive Pharmacy"
        />
      </Container>
      <Container maxWidth="false" className="no-padding">
        <Typography className="label">Menu</Typography>
        <Box className="menu-links">
          <List>
            <ListItem>
              <Link to="/users" onClick={() => setSidebarActive(false)}>
                <PeopleAltIcon />
                Accounts
              </Link>
            </ListItem>
            {role === "Admin" && (
              <ListItem>
                <Link to="/tickets" onClick={() => setSidebarActive(false)}>
                  <ConfirmationNumberIcon />
                  Ticketing
                </Link>
              </ListItem>
            )}
            {role === "Admin" && (
              <ListItem>
                <Link to="/branches" onClick={() => setSidebarActive(false)}>
                  <ApartmentIcon />
                  Branches
                </Link>
              </ListItem>
            )}
            <ListItem>
              <Link
                to="/resources-index"
                onClick={() => setSidebarActive(false)}
              >
                <FileCopyIcon />
                Resources
              </Link>
            </ListItem>
          </List>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography className="label">Settings</Typography>
        <Box className="menu-settings">
          <List>
            {role === "Admin" && (
              <ListItem>
                <Link
                  to="/user-management"
                  onClick={() => setSidebarActive(false)}
                >
                  <ManageAccountsIcon />
                  Roles Management
                </Link>
              </ListItem>
            )}
            {role === "Admin" && (
              <ListItem>
                <Link to="/staff-logs" onClick={() => setSidebarActive(false)}>
                  <ListAltIcon />
                  Activity Logs
                </Link>
              </ListItem>
            )}
            <ListItem>
              <Link to="/login" onClick={() => handleLogout()}>
                <LogoutIcon />
                Logout
              </Link>
            </ListItem>
          </List>
        </Box>
      </Container>
      <Container maxWidth="false">
        <Box className="timer">
          <Typography className="day">{datetime.day}</Typography>
          <Typography className="date">{datetime.date}</Typography>
          <Typography className="time">{datetime.time}</Typography>
        </Box>
      </Container>
    </Paper>
  );
}
