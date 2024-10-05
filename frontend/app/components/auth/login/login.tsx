import React from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import ResetPasswordForm from "../reset/ResetPasswordForm";
import logicLogic from "./logicLogic";

const Login = () => {
  const {
    snackbar,
    handleClose,
    username,
    password,
    resetPasswordDialogOpen,
    handleResetPasswordDialogClose,
    handleSubmit,
    setUsername,
    setPassword,
    setResetPasswordDialogOpen,
  } = logicLogic();

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        id="login"
        label="Login"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <TextField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        Log in
      </Button>

      <Button
        color="secondary"
        onClick={() => setResetPasswordDialogOpen(true)}
      >
        Nie pamietasz hasla?
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ResetPasswordForm
        open={resetPasswordDialogOpen}
        handleClose={handleResetPasswordDialogClose}
      />
    </Box>
  );
};

export default Login;
