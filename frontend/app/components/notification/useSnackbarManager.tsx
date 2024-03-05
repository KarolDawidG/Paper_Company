import React, { useState } from "react";

const useSnackbarManager = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "info" | "warning" | "error",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return { snackbar, showSnackbar, handleClose };
};

export default useSnackbarManager;
