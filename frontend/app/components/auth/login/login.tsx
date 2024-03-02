import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { decodeJwt } from 'jose';
import { TextField, Button, Grid, Typography, Snackbar, Alert } from '@mui/material';
import useSnackbarManager from '../../useSnackbarManager';

const Login = () => {
  const { snackbar, showSnackbar, handleClose } = useSnackbarManager();
  const BACKEND:string = process.env.NEXT_PUBLIC_BACKEND as string;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
    
      const response = await axios.post(`${BACKEND}/auth`, { 
        username, 
        password });

      if (response && response.status === 200) {
        const token = response.data.token;
        const idUser = response.data.idUser;

        localStorage.setItem("token", token);
        localStorage.setItem("idUser", idUser);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decodedToken: any = decodeJwt(token);
        const userRole = decodedToken.role;
        localStorage.setItem("role", userRole);


      router.push('/dashboard');
      }
    } catch (error:any) {
      showSnackbar(error.response.data, 'error');
    }
  };

  
  return (
    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
      <Typography variant="h5">Logowanie</Typography>
      <form onSubmit={handleSubmit}>
        <Grid item>
          <TextField
            id="login"
            label="Login"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained" color="primary">
            Log In
          </Button>
        </Grid>
      </form>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Login;
