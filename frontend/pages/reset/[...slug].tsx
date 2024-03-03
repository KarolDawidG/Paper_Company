import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { notify } from '@/app/components/notification/Notify';
import { Box, Typography, Button, TextField } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/logo.png';
import Footer from '@/app/components/layout/Footer';

export default function Reset() {
  const router = useRouter();
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND as string;
  const { slug } = router.query;
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const passwordsMatch = password === password2;
  const handleMain = () => {router.push('/')};
  
  let id:any, token:any;
    if (router.query.slug && Array.isArray(router.query.slug)) {
      [id, token] = router.query.slug;
    }

  useEffect(() => {
    if (!id || !token) {
      // Id lub token nie są jeszcze dostępne, nie wykonuj żądania
      return;
    }

    const handleResetLink = async () => {
      try {
        const response = await axios.get(`${BACKEND}/${id}/${token}`);
        if (response.status !== 200) {
          notify(response.data.message);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    handleResetLink();
  }, [id, token]);

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    if (!passwordsMatch) {
      console.log("Passwords do not match!");
      return;
    } 

    if (slug && Array.isArray(slug) && slug.length === 2) {
      const [id, token] = slug;
      try {
        const response = await axios.post(`${BACKEND}/reset/${id}/${token}`, {
          password,
          password2,
        });

        if (response.status === 200) {
          notify("Password has been reset successfully.");
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (error) {
        notify("Some error occured.")
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} textAlign="center" my={1}>
        <Image src={logo} alt="Logo" width={250} height={250} />
        <Typography variant="h4" gutterBottom>Reset Password!</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nowe hasło"
              required
            />
            <TextField
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Potwierdź hasło"
              required
            />
            <Button type="submit" disabled={!passwordsMatch} variant="contained" sx={{ mt: 1 }}>
              Zresetuj hasło
            </Button>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleMain}>
              Strona Glowna
            </Button>
          </Box>
        </form>
      </Box>
      <Footer />
  </Box>
  );
}
