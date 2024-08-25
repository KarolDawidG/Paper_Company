import { useState } from 'react';
import { LinearProgress, Collapse, Card, CardHeader, CardContent, Button, TablePagination } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Mail } from '../Interfaces/MailInterface';
import { fetchMailsData, deleteMail } from '../Api/FetchMailsData';
import { MailDialog } from './MailDialog';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import useSearchLogic from '@/app/components/utils/tableUtils/SearchControl';
import BaseDialog from '@/app/components/utils/BaseDialog';
import MailBoxHeader from './MailBoxHeader'; 
import EmailListContent from './EmailListContent';

export const MailBox = () => {
  const [expanded, setExpanded] = useState(false);
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Mail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData} = useSearchLogic({ data: emails }); 

  const loadEmails = async () => {
    setLoading(true);
    try {
      await fetchMailsData(setEmails);
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
    setEmailToDelete(emailId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (emailToDelete) {
      await deleteMail(emailToDelete, setEmails);
    }
    setDialogOpen(false);
    setEmailToDelete(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setEmailToDelete(null);
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

      <MailBoxHeader emailsLength={emails.length} />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <>
            <EmailListContent
                paginatedEmails={paginatedEmails}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEmailClick={handleEmailClick}
                handleDeleteClick={handleDeleteClick}
              />

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