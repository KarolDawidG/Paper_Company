import React from "react";
import { Button, TextField, Box, Snackbar, Alert } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import registerLogic from "./registerLogic";

const Register = () => {

  const {
    isHuman,
    captchaRef,
    snackbar,
    handleClose,
    REACT_APP_SITE_KEY,
    userData,
    handleChange,
    onCaptchaChange,
    handleSubmit,
  } = registerLogic();

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Nazwa użytkownika"
        name="username"
        autoComplete="username"
        autoFocus
        value={userData.username}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Adres email"
        name="email"
        autoComplete="email"
        value={userData.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Hasło"
        type="password"
        id="password"
        autoComplete="current-password"
        value={userData.password}
        onChange={handleChange}
      />

      <ReCAPTCHA
        ref={captchaRef}
        sitekey={REACT_APP_SITE_KEY}
        onChange={onCaptchaChange}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!isHuman}
      >
        Zarejestruj się
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
    </Box>
  );
};

export default Register;
