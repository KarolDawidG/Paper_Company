import { useEffect, useState } from 'react';
import { LinearProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button, TablePagination } from '@mui/material';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import SetPageComponent from '@/app/components/utils/tableUtils/SetPageComponent';
import useSearchLogic from '@/app/components/utils/tableUtils/SearchControl';
import { fetchEmployeeData } from '../Api/FetchEmployeeData';
import { EmployeeInterface } from '../Interfaces/EmployeeInterface';
import useTranslation from '@/app/components/language/useTranslation';

export const EmployeeTable = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeInterface[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInterface | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic<EmployeeInterface>({ data: employeeData });
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  
  useEffect(() => {
    fetchEmployeeData(setEmployeeData);
  }, []);

  const handleRowClick = (employee: EmployeeInterface) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
  };

  if (!t.table) {
    return <LinearProgress />;
  }

  return (
    <div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t.table.no}</TableCell>
              <TableCell>{t.table.first_name}</TableCell>
              <TableCell>{t.table.second_name}</TableCell>
              <TableCell>{t.table.role}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((employee, index) => (
              <TableRow
                key={employee.id}
                onClick={() => handleRowClick(employee)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedEmployee?.id === employee.id ? 'lightgrey' : 'inherit',
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{employee.first_name}</TableCell>
                <TableCell>{employee.last_name}</TableCell>
                <TableCell>{employee.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SetPageComponent 
        page={page}
        setPage={setPage}
        sortedData={filteredData}
        rowsPerPage={rowsPerPage} 
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: `${t.table.all}`, value: -1 }]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={`${t.table.rows_per_page}`}
      />

      {selectedEmployee && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>{t.human_resources.employee_details}</DialogTitle>
          <DialogContent>
            <Typography variant="h6">{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>E-mail:</strong> {selectedEmployee.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t.table.phone}:</strong> {selectedEmployee.phone_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t.table.department}:</strong> {selectedEmployee.department}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t.table.position}:</strong> {selectedEmployee.position}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t.table.date_employment}</strong> {new Date(selectedEmployee.hire_date).toLocaleDateString()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
