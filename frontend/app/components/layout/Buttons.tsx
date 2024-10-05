import React from 'react';
import { Button } from '@mui/material';

const mainButtonStyle = {
  width: 150,
  height: 40,
  marginBottom: 2,
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.dark',
  }
};

export const MainButton = ({ children, variant="contained", color="primary", onClick, sx, ...props }:any) => {
  return (
    <Button
      variant={variant}
      color={color}
      sx={{ ...mainButtonStyle, ...sx }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

const disableButtonStyle = {
  width: 150,
  height: 40,
  backgroundColor: 'primary.main',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
    color: '#666'
  }
};

export const DisableButton = ({ children, onClick, disabled, sx, ...props }:any) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={{ ...disableButtonStyle, ...sx }}
      {...props}
    >
      {children}
    </Button>
  );
};
