import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { blue, green, grey, lime, red } from "@mui/material/colors";

import "@fontsource-variable/outfit";

import "./App.scss";

import AppRouter from "./AppRouter";

import Global from "./util/global";

import { SnackbarProvider } from "notistack";

export default function App() {
  const [sidebarActive, setSidebarActive] = useState(false);

  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const globals = {
    authUser,
    setAuthUser,
    sidebarActive,
    setSidebarActive,
  };

  const snackbar = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={customTheme()}>
        <Global.Provider value={globals}>
          <AppRouter />
          <SnackbarProvider anchorOrigin={snackbar.anchorOrigin} />
        </Global.Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function customTheme() {
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
      },
    },
    typography: {
      fontFamily: `"Outfit Variable", sans-serif, Arial`,
    },
    palette: {
      primary: {
        light: lime[500],
        main: lime[600],
        dark: lime[700],
        contrastText: "#fff",
      },
      white: {
        light: grey[50],
        main: grey[100],
        dark: grey[200],
        contrastText: "#000",
      },
      black: {
        light: grey[700],
        main: grey[900],
        dark: grey[800],
        contrastText: "#fff",
      },
      grey: {
        light: grey[400],
        main: grey[500],
        dark: grey[600],
        contrastText: "#fff",
      },
      red: {
        light: red[700],
        main: red[900],
        dark: red[800],
        contrastText: "#fff",
      },
      green: {
        light: green[700],
        main: green[900],
        dark: green[800],
        contrastText: "#fff",
      },
      blue: {
        light: blue[700],
        main: blue[900],
        dark: blue[800],
        contrastText: "#fff",
      },
    },
  });
}
