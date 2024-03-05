import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { decodeJwt } from "jose";
import { TextField, Button, Grid, Box, Snackbar, Alert } from "@mui/material";
import useSnackbarManager from "../../notification/useSnackbarManager";
import ResetPasswordForm from "../reset/ResetPasswordForm";

const Login = () => {
  const { snackbar, showSnackbar, handleClose } = useSnackbarManager();
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleResetPasswordDialogClose = ({ success, message }: any) => {
    setResetPasswordDialogOpen(false);
    showSnackbar(message, success ? "info" : "error");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BACKEND}/auth`, {
        username,
        password,
      });

      if (response && response.status === 200) {
        const token = response.data.token;
        const idUser = response.data.idUser;

        localStorage.setItem("token", token);
        localStorage.setItem("idUser", idUser);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decodedToken: any = decodeJwt(token);
        const userRole = decodedToken.role;
        localStorage.setItem("role", userRole);

        router.push("/dashboard");
      }
    } catch (error: any) {
      showSnackbar(error.response.data, "error");
    }
  };

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
        Log In
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
