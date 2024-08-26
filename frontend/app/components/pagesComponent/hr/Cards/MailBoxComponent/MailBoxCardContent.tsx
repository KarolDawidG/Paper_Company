import { Typography, CardContent, LinearProgress } from '@mui/material';
import React from 'react';
import useTranslation from '@/app/components/language/useTranslation';
import { E_MAIL } from '@/app/components/utils/links';

interface MailBoxHeaderProps {
  emailsLength: number;
}

const MailBoxCardContent: React.FC<MailBoxHeaderProps> = ({ emailsLength }) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

    if (!t.human_resources) {
      return <LinearProgress />;
    }

  return (
    <CardContent>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t.human_resources.email_box} {E_MAIL}
      </Typography>
      <Typography variant="body1" paragraph>
        {t.human_resources.email_box_description}
      </Typography>
      {emailsLength === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t.human_resources.no_new_emails}
        </Typography>
      )}
    </CardContent>
  );
};

export default MailBoxCardContent;
