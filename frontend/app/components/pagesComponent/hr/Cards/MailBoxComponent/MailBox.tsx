import { useState } from 'react';
import { LinearProgress, Collapse, Card, CardHeader, CardContent, Button, TablePagination } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Mail } from '../Interfaces/MailInterface';
import { fetchMailsData, deleteMail } from '../Api/FetchMailsData';
import { MailDialog } from './MailDialog';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import useSearchLogic from '@/app/components/utils/tableUtils/SearchControl';
import BaseDialog from '@/app/components/utils/BaseDialog';
import MailBoxHeader from './MailBoxCardContent'; 
import EmailListContent from './EmailListContent';
import useTranslation from '@/app/components/language/useTranslation';

export const MailBox = () => {
  const [expanded, setExpanded] = useState(false);
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Mail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData} = useSearchLogic({ data: emails }); 
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

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

  if (!t.human_resources) {
    return <LinearProgress />;
  }

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader
        title={t.human_resources.inbox_title}
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
            <Button onClick={handleRefresh} aria-label="refresh" sx={{ marginLeft: 1 }}>{t.human_resources.refresh}</Button>
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
                labelRowsPerPage={`${t.table.rows_per_page}`}
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
        title={t.human_resources.confirm_delete}
      >
        {t.human_resources.confirm_delete_question}
      </BaseDialog>
    </Card>
  );
};