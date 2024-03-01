"use client";

import React, { useState } from 'react';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import { Button, Typography, Container, Box } from '@mui/material';

export default function Home() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false); 

  return (
    <Container>
      <Box textAlign="center" marginTop={8}>
        <Typography variant="h2" gutterBottom>
          Paper Company
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Centrala logowania
        </Typography>
        <Box marginTop={2}>
          <Button variant="contained" color="primary" onClick={() => setLoginModalOpen(true)} sx={{ marginRight: 2 }}>
            Logowanie
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setRegisterModalOpen(true)}>
            Rejestracja
          </Button>
        </Box>
      </Box>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </Container>
  );
}