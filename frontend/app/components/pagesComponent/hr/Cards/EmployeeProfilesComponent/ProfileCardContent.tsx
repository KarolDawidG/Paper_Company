import React from 'react';
import { CardContent, LinearProgress, Typography } from '@mui/material';
import useTranslation from '@/app/components/language/useTranslation';

const ProfileCardContent: React.FC = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

    if (!t.human_resources) {
        return <LinearProgress />;
    }
  
  return (
    <CardContent>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t.human_resources.employee_title}
      </Typography>
      <Typography variant="body1" paragraph>
        {t.human_resources.employee_description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t.human_resources.employee_note}  
      </Typography>
    </CardContent>
  );
};

export default ProfileCardContent;
