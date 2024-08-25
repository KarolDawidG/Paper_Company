import { useEffect, useState } from 'react';
import {LinearProgress, Collapse, Card, CardHeader, CardContent, Button, TextField, Select, FormControl, MenuItem, InputLabel, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EmployeeInterface, EmployeeMessageInterface } from './Interfaces/EmployeeInterface';
import { fetchEmployeeData } from './Api/FetchEmployeeData';
import { notify } from '@/app/components/notification/Notify';
import useTranslation from '@/app/components/language/useTranslation';
import axiosInstance from '@/app/api/axiosInstance';
import axios from 'axios';

export const SendMessageToEmployee = () => {
  const [employees, setEmployeeData] = useState<EmployeeInterface[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeInterface[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  
  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSendMessage = () => {
    let recipients: EmployeeInterface[] = [];
  
    if (selectedEmployee === "all-employees") {
    
      recipients = [...filteredEmployees];
    } else if (selectedDepartment === "all-departments") {
      
      recipients = [...employees];
    } else if (selectedDepartment && !selectedEmployee) {
    
      recipients = [...filteredEmployees];
    } else if (selectedEmployee) {
  
      const employee = employees.find(e => e.id === selectedEmployee);
      if (employee) {
        recipients = [employee];
      }
    }
  
    if (recipients.length > 0) {
      const emailData: EmployeeMessageInterface[] = recipients.map((employee) => ({
        to: employee.email,
        subject: subject,
        message: message,
      }));
  
      axios.post('http://localhost:3001/mail', emailData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log('Emails sent successfully:', response.data);
        notify("Emails sent successfully");
      })
      .catch(error => {
        console.error('Error sending emails:', error);
        notify("Error sending emails");
      });
    }
  };

    useEffect(() => {
    if (selectedDepartment === "all-departments") {
      setFilteredEmployees(employees);
    } else if (selectedDepartment) {
      setFilteredEmployees(employees.filter(emp => emp.department === selectedDepartment));
    } else {
      setFilteredEmployees([]);
    }
  }, [selectedDepartment, employees]);
  

  useEffect(() => {
    fetchEmployeeData(setEmployeeData);
  }, []);

  if (!t.human_resources) {
    return <LinearProgress />;
  }

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader
        title={t.human_resources.send_message_employee}
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
          Centrum Wysyłania Wiadomości
        </Typography>
        <Typography variant="body1" paragraph>
          Centrum wysyłania wiadomości umożliwia masowe wysyłanie e-maili do pracowników różnych działów, pojedynczych wybranych osób lub wszystkich w organizacji. 
          Skorzystaj z tej funkcji, aby efektywnie zarządzać komunikacją i informować pracowników o istotnych sprawach.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Jeśli potrzebujesz pomocy przy tworzeniu wiadomości lub konfiguracji odbiorców, zapoznaj się z dokumentacją lub skontaktuj się z działem wsparcia. Przed wysłaniem ważnych wiadomości, zalecamy wysłanie testowego e-maila, aby upewnić się, że wszystko działa poprawnie.
        </Typography>
      </CardContent>


      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="department-select-label">{t.human_resources.select_department}</InputLabel>
            <Select
              labelId="department-select-label"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as string)}
              label="Select Department"
            >
              <MenuItem value="all-departments">{t.human_resources.all_department}</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl fullWidth margin="normal" disabled={!selectedDepartment}>
            <InputLabel id="employee-select-label">{t.human_resources.select_employee}</InputLabel>
            <Select
              labelId="employee-select-label"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value as string)}
              label="Select Employee"
            >
              <MenuItem value="all-employees">{t.human_resources.all_employee}</MenuItem>
              {filteredEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <TextField
            fullWidth
            label={t.human_resources.subject}
            margin="normal"
            value={subject}
            onChange={(e) => setSubject(e.target.value as string)}
          />

          <TextField
            fullWidth
            label={t.human_resources.message}
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value as string)}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={() => handleSendMessage()}
            disabled={!subject || !message}
          >
            {t.human_resources.send_message}
          </Button>

        </CardContent>
      </Collapse>
    </Card>
  );
};
