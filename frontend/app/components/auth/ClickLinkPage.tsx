import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation'; 

const ClickLinkPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
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
  );
};

export default ClickLinkPage;
