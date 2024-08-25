import { useState } from 'react';
import {LinearProgress, Collapse, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EmployeeTable } from './EmployeeTable/EmployeeTable';
import useTranslation from '@/app/components/language/useTranslation';


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
        title="Employee Profiles"
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
      
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Lista Wszystkich Pracowników
        </Typography>
        <Typography variant="body1" paragraph>
          Tabela zawiera pełną listę pracowników wraz z podstawowymi informacjami, takimi jak imię, nazwisko, dział oraz stanowisko. Umożliwia to szybki przegląd i dostęp do kluczowych danych dotyczących każdego pracownika w organizacji.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          W przypadku potrzeby szczegółowych informacji o konkretnym pracowniku lub edycji danych, skontaktuj się z działem HR. Lista jest aktualizowana regularnie, aby zapewnić dokładność informacji.
        </Typography>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
            <EmployeeTable />
        </CardContent>
      </Collapse>
    </Card>
  );
};
