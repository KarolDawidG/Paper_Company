import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation'; 
import Footer from '../layout/Footer';
import Image from 'next/image';
import logo from '../../../public/logo.png';

const ClickLinkPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} textAlign="center" my={2}>
        <Image src={logo} alt="Logo Paper Company" width={250} height={250} />
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Dziękujemy za rejestrację!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Wysłaliśmy link aktywacyjny na Twój adres email. Kliknij w link, aby aktywować swoje konto.
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={handleBack}>
            Powrót do strony głównej
          </Button>
        </Box>
      </Box>
      <Footer/>
    </Box>
  );
};

export default ClickLinkPage;
