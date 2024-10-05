import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TablePagination, Button, Select, FormControl, InputLabel, MenuItem, IconButton, LinearProgress} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { TableProps } from './TableInterfaces';
import { formatOnlyDate } from '../../../helpers/formDate';
import TableLogic from './TableLogic';
import { Role } from './RolaEnum';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import useTranslation from '@/app/components/language/useTranslation';
import SetPageComponent from '@/app/components/utils/tableUtils/SetPageComponent';

const CustomTable: React.FC<TableProps> = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
  const {searchTerm, setSearchTerm, selectedRoles, setSelectedRoles, handleChangeRole, handleDeleteUser, filteredData} = TableLogic();

  const roleOptions = Object.values(Role).map((role) => (
    <MenuItem key={role} value={role.toLowerCase()}>
      {role}
    </MenuItem>
  ));

    if (!t.table) {
      return <LinearProgress />;
    }


  return (
    <Box padding={1}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t.table.no}</TableCell>
              <TableCell>{t.table.date_employment}</TableCell>
              <TableCell>{t.table.first_last_name}</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>{t.table.role}</TableCell>
              <TableCell>{t.table.delete}</TableCell>
              <TableCell>{t.table.update}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{formatOnlyDate(user.created_at)}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteUser(user.id)}>
                    {t.table.delete}
                  </Button>
                </TableCell>
                <TableCell>
                  <FormControl variant="outlined">
                    <InputLabel id={`role-label-${user.id}`}></InputLabel>
                    <Select
                      labelId={`role-label-${user.id}`}
                      id={`role-select-${user.id}`}
                      value={selectedRoles[user.id] || 'user'}
                      label="Rola"
                      size='small'
                      onChange={(e) => {
                        setSelectedRoles((prevRoles) => ({
                          ...prevRoles,
                          [user.id]: e.target.value as string,
                        }));
                      }}
                    >
                      {roleOptions}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => handleChangeRole(user.id)}>
                    <CheckCircleOutline />
                  </IconButton>
                </TableCell>

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
    </Box>
  );
};

export default CustomTable;