import { useState } from 'react';
import { LinearProgress, Collapse, Card, CardHeader, CardContent, Button, Typography, List, ListItem, ListItemText, Divider, Box, IconButton, TablePagination } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { Mail } from './Interfaces/MailInterface';
import { fetchMailsData, deleteMail } from './Api/FetchMailsData';
import { MailDialog } from './MailDialog';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import useSearchLogic from '@/app/components/utils/tableUtils/SearchControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import BaseDialog from '@/app/components/utils/BaseDialog';

export const exampleEmails: Mail[] = [
  {
    from: "john.doe@example.com",
    subject: "Meeting Reminder",
    text: "Hi there, just a quick reminder about our meeting scheduled for tomorrow at 10 AM. Please let me know if you need to reschedule.",
    id: "email1"
  },
  {
    from: "jane.smith@company.com",
    subject: "Project Update",
    text: "Hello team, the project is progressing well, and we are on track to meet our deadline. Attached is the latest report. Please review and provide feedback.",
    id: "email2"
  },
  {
    from: "support@service.com",
    subject: "Account Activation",
    text: "Thank you for signing up! Please click the link below to activate your account. If you did not request this, please ignore this email.",
    id: "email3"
  },
  {
    from: "newsletter@news.com",
    subject: "Weekly Newsletter",
    text: "Welcome to our weekly newsletter! Here are the top stories of the week, including updates on the latest trends in technology and business.",
    id: "email4"
  },
  {
    from: "admin@notifications.com",
    subject: "Password Reset Request",
    text: "You have requested a password reset. Click the link below to reset your password. If you did not make this request, please contact our support team.",
    id: "email5"
  }
];


export const MailBox = () => {
  const [expanded, setExpanded] = useState(false);
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Mail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); // Stan do kontrolowania widoczności dialogu
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null); // Stan do przechowywania ID wiadomości do usunięcia

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData} = useSearchLogic({ data: emails }); 

  const loadEmails = async () => {
    setLoading(true);
    try {
      await fetchMailsData(setEmails);
     // setEmails(exampleEmails);
    } finally {
      setLoading(false);
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);

    if (!expanded && emails.length === 0) {
      loadEmails();
    }
  };

  const handleRefresh = () => {
    loadEmails();
  };

  const handleEmailClick = (email: Mail) => {
    setSelectedEmail(email);
  };

  const handleCloseDialog = () => {
    setSelectedEmail(null);
  };

  const handleDeleteClick = (emailId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEmailToDelete(emailId); // Ustawiamy ID wiadomości do usunięcia
    setDialogOpen(true); // Otwieramy dialog
  };

  const handleConfirmDelete = async () => {
    if (emailToDelete) {
      await deleteMail(emailToDelete, setEmails);
    }
    setDialogOpen(false); // Zamykamy dialog po potwierdzeniu
    setEmailToDelete(null); // Reset ID wiadomości do usunięcia
  };

  const handleCancelDelete = () => {
    setDialogOpen(false); // Zamykamy dialog po anulowaniu
    setEmailToDelete(null); // Reset ID wiadomości do usunięcia
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmails = filteredData.slice(startIndex, endIndex);

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader
        title="Mail Box"
        action={
          <>
            <Button
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{ marginLeft: 'auto' }}
            >
              <ExpandMoreIcon />
            </Button>
            <Button onClick={handleRefresh} aria-label="refresh" sx={{ marginLeft: 1 }}>Odśwież</Button>
          </>
        }
      />

      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Skrzynka e-mail: the.paper.company.pl@gmail.com
        </Typography>
        <Typography variant="body1" paragraph>
          Ta skrzynka e-mail jest używana do odbierania wiadomości służbowych. Sprawdź tutaj wszystkie przychodzące wiadomości i zarządzaj nimi zgodnie z obowiązującymi zasadami.
        </Typography>
        {emails.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Obecnie brak nowych wiadomości w skrzynce. Sprawdź ponownie później lub skontaktuj się z administratorem, jeśli uważasz, że powinny być wiadomości.
          </Typography>
        )}
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <>
              <List>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {paginatedEmails.map((email: Mail, index) => (
                  <Box key={index}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ '&:hover': { backgroundColor: '#f0f0f0', cursor: 'pointer' } }}
                      onClick={() => handleEmailClick(email)}
                    >
                      <MailOutlineIcon sx={{ marginRight: 2 }} />
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {email.subject}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary" fontWeight="bold">
                              {email.from}
                            </Typography>
                            {" — " + email.text.slice(0, 100)}
                            {email.text.length > 100 && " ..."}
                          </>
                        }
                      />
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={(event) => handleDeleteClick(email.id, event)} // Zaktualizuj akcję przycisku kasowania
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                    {index < paginatedEmails.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>

              <TablePagination
                component="div"
                count={filteredData.length} 
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />

            </>
          )}
        </CardContent>
      </Collapse>

      <MailDialog 
        open={Boolean(selectedEmail)} 
        email={selectedEmail} 
        onClose={handleCloseDialog} 
      />

      <BaseDialog 
        open={dialogOpen} 
        onClose={handleCancelDelete} 
        onConfirm={handleConfirmDelete} 
        title="Potwierdzenie usunięcia"
      >
        Czy na pewno chcesz usunąć tę wiadomość?
      </BaseDialog>
    </Card>
  );
};
