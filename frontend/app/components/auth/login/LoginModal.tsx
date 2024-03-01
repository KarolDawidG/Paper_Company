import React from 'react';
import Login from './login';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  
  const LoginModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Login />
      </Box>
    </Modal>
  );
};

export default LoginModal;
