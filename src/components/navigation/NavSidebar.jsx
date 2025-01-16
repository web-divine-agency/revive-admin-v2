import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Collapse,
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import Global from "@/util/global";

import "./Navigation.scss";
import { getCookie } from "@/middleware/getCookie";
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

  const [menu, setMenu] = useState({
    tickets: {
      open: false,
    },
    branches: {
      open: false,
    },
  });

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

  const toggleDropdown = (name) => {
    setMenu((prev) => ({
      ...prev,
      [name]: { ...prev[name], open: !menu[name].open },
    }));
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
              <>
                <ListItem>
                  <Link to="#" onClick={() => toggleDropdown("tickets")}>
                    <ConfirmationNumberIcon />
                    Ticketing
                    {menu.tickets.open ? <ExpandLess /> : <ExpandMore />}
                  </Link>
                </ListItem>
                <Collapse
                  component={"li"}
                  in={menu.tickets.open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding>
                    <ListItem>
                      <Link
                        to="/tickets"
                        onClick={() => setSidebarActive(false)}
                      >
                        Ticket List
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link
                        to="/tickets/create"
                        onClick={() => setSidebarActive(false)}
                      >
                        Generate Tickets
                      </Link>
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            {role === "Admin" && (
              <>
                <ListItem>
                  <Link to="#" onClick={() => toggleDropdown("branches")}>
                    <ApartmentIcon />
                    Branches
                    {menu.branches.open ? <ExpandLess /> : <ExpandMore />}
                  </Link>
                </ListItem>
                <Collapse
                  component={"li"}
                  in={menu.branches.open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding>
                    <ListItem>
                      <Link
                        to="/branches"
                        onClick={() => setSidebarActive(false)}
                      >
                        Branches List
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link
                        to="/branches/create"
                        onClick={() => setSidebarActive(false)}
                      >
                        Add New Branch
                      </Link>
                    </ListItem>
                  </List>
                </Collapse>
              </>
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
                <Link to="/user-roles" onClick={() => setSidebarActive(false)}>
                  <ManageAccountsIcon />
                  User Roles
                </Link>
              </ListItem>
            )}
            {role === "Admin" && (
              <ListItem>
                <Link
                  to="/activity-logs"
                  onClick={() => setSidebarActive(false)}
                >
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
          <Typography className="date">{datetime.date}</Typography>
          <Typography className="time">
            {datetime.day}, {datetime.time}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}
