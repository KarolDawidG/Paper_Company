import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import useSnackbarManager from '../../notification/useSnackbarManager';

const Register = () => {
  const { snackbar, showSnackbar, handleClose } = useSnackbarManager();
  const REACT_APP_SITE_KEY:string = process.env.NEXT_PUBLIC_REACT_APP_SITE_KEY as string;
  const BACKEND:string = process.env.NEXT_PUBLIC_BACKEND as string;
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isHuman, setIsHuman] = useState(false);
  const captchaRef = useRef<ReCAPTCHA | null>(null);
  const router = useRouter();

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

  const onCaptchaChange = async (token: string | null) => {
    if (token){
      try {
        const responseCaptcha = await axios.post(`${BACKEND}/cap`, {token});
        if (responseCaptcha.data === "Human 👨 👩" ) {
          setCaptchaValue(token);
          setIsHuman(true);
        } else {
          setIsHuman(false)
        }
      } catch(error:any) {
        showSnackbar(error.response.data, 'error');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent)  => {
    event.preventDefault();
    try {
      
      const response = await axios.post(`${BACKEND}/register`, userData);
      if (response.status === 200) {
        
        console.log('Rejestracja udana:', response.data);
        setTimeout(() => router.push('/click-link'), 1000);
      }
    } catch (error:any) {
      showSnackbar(error.response.data, 'error');
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Register;
