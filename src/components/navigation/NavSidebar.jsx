import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";

import {
  Box,
  Collapse,
  Container,
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

import "./Navigation.scss";

import Global from "@/util/global";

export default function NavSidebar() {
  const navigate = useNavigate();

  const { sidebarActive, setSidebarActive, authUser, setAuthUser } =
    useContext(Global);

  const [datetime, setDatetime] = useState({
    day: "",
    date: "",
    time: "",
  });

  const [menu, setMenu] = useState({
    tickets: {
      open: false,
    },
    branches: {
      open: false,
    },
    resources: {
      open: false,
    },
    user_roles: {
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
      <Container maxWidth="false" className="menu-holder no-padding">
        <Typography className="label">Menu</Typography>
        <Box className="menu-links">
          <List>
            {authUser?.role_name === "Admin" && (
              <ListItem>
                <Link to="/users" onClick={() => setSidebarActive(false)}>
                  <PeopleAltIcon />
                  Accounts
                </Link>
              </ListItem>
            )}
            {(authUser?.role_name === "Admin" ||
              authUser?.role_name === "Staff") && (
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
                    {authUser?.role_name === "Admin" && (
                      <>
                        <ListItem>
                          <Link
                            to="/ticket-category"
                            onClick={() => setSidebarActive(false)}
                          >
                            Ticket Categories
                          </Link>
                        </ListItem>
                        <ListItem>
                          <Link
                            to="/templates"
                            onClick={() => setSidebarActive(false)}
                          >
                            Template Access
                          </Link>
                        </ListItem>
                      </>
                    )}
                  </List>
                </Collapse>
              </>
            )}
            {authUser?.role_name === "Admin" && (
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
              <Link to="#" onClick={() => toggleDropdown("resources")}>
                <FileCopyIcon />
                Resources
                {menu.resources.open ? <ExpandLess /> : <ExpandMore />}
              </Link>
            </ListItem>
            <Collapse
              component={"li"}
              in={menu.resources.open}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {authUser?.role_name === "Admin" && (
                  <ListItem>
                    <Link
                      to="/resources-index"
                      onClick={() => setSidebarActive(false)}
                    >
                      List Resources
                    </Link>
                  </ListItem>
                )}
                {authUser?.role_name === "Admin" && (
                  <ListItem>
                    <Link
                      to="/resources/create"
                      onClick={() => setSidebarActive(false)}
                    >
                      Add Resource
                    </Link>
                  </ListItem>
                )}
                {authUser?.role_name === "Admin" && (
                  <ListItem>
                    <Link
                      to="/resource-categories"
                      onClick={() => setSidebarActive(false)}
                    >
                      List Categories
                    </Link>
                  </ListItem>
                )}
                {authUser?.role_name === "Admin" && (
                  <ListItem>
                    <Link
                      to="/resource-categories/create"
                      onClick={() => setSidebarActive(false)}
                    >
                      Add Category
                    </Link>
                  </ListItem>
                )}
              </List>
            </Collapse>
          </List>
        </Box>
        <Typography className="label">Settings</Typography>
        <Box className="menu-settings">
          <List>
            {authUser?.role_name === "Admin" && (
              <>
                <ListItem>
                  <Link to="#" onClick={() => toggleDropdown("user_roles")}>
                    <ManageAccountsIcon />
                    User Roles
                    {menu.resources.open ? <ExpandLess /> : <ExpandMore />}
                  </Link>
                </ListItem>
                <Collapse
                  component={"li"}
                  in={menu.user_roles.open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding>
                    <ListItem>
                      <Link
                        to="/user-roles"
                        onClick={() => setSidebarActive(false)}
                      >
                        List Roles
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link
                        to="/permissions"
                        onClick={() => setSidebarActive(false)}
                      >
                        List Permissions
                      </Link>
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            {authUser?.role_name === "Admin" && (
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
