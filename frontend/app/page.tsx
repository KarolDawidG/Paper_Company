"use client";

import React, { useState } from "react";
import Image from "next/image";
import AuthModal from "./components/auth/AuthModal";
import { Button, Typography, Container, Box } from "@mui/material";
import logo from "../public/logo.png";
import Register from "./components/auth/register/register";
import Login from "./components/auth/login/login";

export default function Home() {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  return (
    <Container>
      <Box textAlign="center" marginTop={8}>
        <Image src={logo} alt="Logo Paper Company" width={300} height={300} />
        <Typography variant="h2" gutterBottom>
          Paper Company
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Centrala logowania
        </Typography>
        <Box marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalType("login")}
            sx={{ marginRight: 2 }}
          >
            Logowanie
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setModalType("register")}
          >
            Rejestracja
          </Button>
        </Box>
      </Box>
      <AuthModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={modalType === "login" ? "Logowanie" : "Rejestracja"}
      >
        {modalType === "login" ? <Login /> : <Register />}
      </AuthModal>
    </Container>
  );
}
