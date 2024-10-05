import { useState } from 'react';
import {LinearProgress, Collapse, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useTranslation from '@/app/components/language/useTranslation';
import ProfileCardContent from './ProfileCardContent';
import { EmployeeTable } from './EmployeeTable/EmployeeTable';


export const EmployeeProfiles = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    if (!t.human_resources) {
      return <LinearProgress />;
    }

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader
        title={t.human_resources.employee_profiles}
        action={
          <Button
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ marginLeft: 'auto' }}
          >
            <ExpandMoreIcon />
          </Button>
        }
      />
      
      <ProfileCardContent />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
            <EmployeeTable />
        </CardContent>
      </Collapse>
    </Card>
  );
};
