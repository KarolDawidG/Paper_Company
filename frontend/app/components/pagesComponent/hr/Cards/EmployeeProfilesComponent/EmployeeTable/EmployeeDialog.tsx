import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import useTranslation from '@/app/components/language/useTranslation';
import { EmployeeDialogProps } from '../../Interfaces/EmployeeDialogProps';

const renderEmployeeDetail = (label:string, value:string) => (
    <Typography variant="body2" color="text.secondary">
      <strong>{label}:</strong> {value}
    </Typography>
  );

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({ open, onClose, employee }) => {
    const [currentLocale, setCurrentLocale] = useState("en");
    const t = useTranslation(currentLocale);

    useEffect(() => {
        const locale = localStorage.getItem("locale") || "en";
        setCurrentLocale(locale);
      }, []);
  
    if (!employee || !t?.table) {
        return <LinearProgress />;
      }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t.human_resources.employee_details}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{`${employee.first_name} ${employee.last_name}`}</Typography>
        {renderEmployeeDetail('E-mail', employee.email)}
        {renderEmployeeDetail(t.table.phone, employee.phone_number)}
        {renderEmployeeDetail(t.table.department, employee.department)}
        {renderEmployeeDetail(t.table.position, employee.position)}
        {renderEmployeeDetail(t.table.date_employment, new Date(employee.hire_date).toLocaleDateString())}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t.table.close}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;
