import React from "react";
import { TextField } from "@mui/material";

interface FormFieldsProps {
  editedData: { username: string; email: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ editedData, handleInputChange }) => (
  <form>
    <TextField
      label="Username"
      variant="outlined"
      fullWidth
      id="username"
      name="username"
      value={editedData.username}
      onChange={handleInputChange}
    />
    <TextField
      label="E-mail"
      variant="outlined"
      fullWidth
      id="email"
      name="email"
      type="email"
      value={editedData.email}
      onChange={handleInputChange}
    />
  </ form>
);

export default FormFields;
