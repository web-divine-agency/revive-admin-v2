import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { grey, lime } from "@mui/material/colors";

import "@fontsource-variable/outfit";

import "./App.scss";

import AppRouter from "./AppRouter";

import Global from "./util/global";

import { LoaderProvider } from "./components/Loaders/LoaderContext";

export default function App() {
  const [sidebarActive, setSidebarActive] = useState(false);

  const globals = {
    sidebarActive,
    setSidebarActive,
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={customTheme()}>
        <Global.Provider value={globals}>
          <LoaderProvider>
            <AppRouter />
          </LoaderProvider>
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
      fontFamily: `"Outfit Variable", sans-serif`,
    },
    palette: {
      primary: {
        light: lime[700],
        main: lime[900],
        dark: lime[800],
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
    },
  });
}
