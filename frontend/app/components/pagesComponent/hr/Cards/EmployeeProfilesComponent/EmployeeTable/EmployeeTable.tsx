import { useEffect, useMemo, useState } from 'react';
import { LinearProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button, TablePagination } from '@mui/material';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import SetPageComponent from '@/app/components/utils/tableUtils/SetPageComponent';
import useSearchLogic from '@/app/components/utils/tableUtils/SearchControl';
import useTranslation from '@/app/components/language/useTranslation';
import { EmployeeInterface } from '../../Interfaces/EmployeeInterface';
import { fetchEmployeeData } from '../../Api/FetchEmployeeData';
import EmployeeDialog from './EmployeeDialog';

export const EmployeeTable = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeInterface[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInterface | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic<EmployeeInterface>({ data: employeeData });
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const [currentLocale, setCurrentLocale] = useState("en");
  const t = useTranslation(currentLocale);
  
  const paginatedData = useMemo(() => (
    rowsPerPage > 0
      ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredData
  ), [filteredData, page, rowsPerPage]);
  
  
  useEffect(() => {
    const locale = localStorage.getItem("locale") || "en";
    setCurrentLocale(locale);
  }, []);

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

  if (!t?.table) {
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
            {(paginatedData
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
          <EmployeeDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            employee={selectedEmployee}
          />
      )}
    </div>
  );
};
