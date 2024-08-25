import React from 'react';
import { List, ListItem, ListItemText, Box, Typography, IconButton, Divider } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import { Mail } from '../Interfaces/MailInterface';

interface EmailListContentProps {
  paginatedEmails: Mail[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleEmailClick: (email: Mail) => void;
  handleDeleteClick: (emailId: string, event: React.MouseEvent) => void;
}

const EmailListContent: React.FC<EmailListContentProps> = ({
  paginatedEmails,
  searchTerm,
  setSearchTerm,
  handleEmailClick,
  handleDeleteClick
}) => (
  <List>
    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    {paginatedEmails.map((email, index) => (
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
            onClick={(event) => handleDeleteClick(email.id, event)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
        {index < paginatedEmails.length - 1 && <Divider />}
      </Box>
    ))}
  </List>
);

export default EmailListContent;
