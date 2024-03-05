import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5E97F3",
    },
    secondary: {
      main: "#FFC107",
    },
    background: {
      default: "#f4f5f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: "2.2rem",
    },
    h2: {
      fontSize: "1.8rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5E97F3",
    },
    secondary: {
      main: "#FFC107",
    },
    background: {
      default: "#121212",
      paper: "#424242",
    },
    text: {
      primary: "#ffffff",
      secondary: "#eeeeee",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: "2.2rem",
    },
    h2: {
      fontSize: "1.8rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
