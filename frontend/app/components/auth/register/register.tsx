import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';

const register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent)  => {
    event.preventDefault();
    try {
      // Tymczasowy URL - zmień na odpowiedni endpoint API
      const response = await axios.post('http://localhost:3001/register', userData);
      if (response.status === 200) {
        // Sukces rejestracji, można przekierować lub wyświetlić komunikat
        console.log('Rejestracja udana:', response.data);
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
    }
  };

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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Zarejestruj się
      </Button>
    </Box>
  );
};

export default register;
