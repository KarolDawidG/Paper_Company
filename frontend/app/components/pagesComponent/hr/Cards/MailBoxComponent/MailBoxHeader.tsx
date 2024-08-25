import { Typography, CardContent } from '@mui/material';
import React from 'react';

interface MailBoxHeaderProps {
  emailsLength: number;
}

const MailBoxHeader: React.FC<MailBoxHeaderProps> = ({ emailsLength }) => (
  <CardContent>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Skrzynka e-mail: the.paper.company.pl@gmail.com
    </Typography>
    <Typography variant="body1" paragraph>
      Ta skrzynka e-mail jest używana do odbierania wiadomości służbowych. Sprawdź tutaj wszystkie przychodzące wiadomości i zarządzaj nimi zgodnie z obowiązującymi zasadami.
    </Typography>
    {emailsLength === 0 && (
      <Typography variant="body2" color="text.secondary">
        Obecnie brak nowych wiadomości w skrzynce. Sprawdź ponownie później lub skontaktuj się z administratorem, jeśli uważasz, że powinny być wiadomości.
      </Typography>
    )}
  </CardContent>
);

export default MailBoxHeader;
