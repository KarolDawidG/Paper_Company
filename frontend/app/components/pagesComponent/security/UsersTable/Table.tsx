import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  TablePagination,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { TableProps } from './TableInterfaces';
import { formatOnlyDate } from '../../../helpers/formDate';
import TableLogic from './TableLogic';
import { Role } from './RolaEnum';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';

const CustomTable: React.FC<TableProps> = () => {
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage
} = usePaginationLogic();

  const {
    searchTerm,
    setSearchTerm,
    selectedRoles, setSelectedRoles,
    handleChangeRole,
    handleDeleteUser,
    filteredData,
  } = TableLogic();

  const roleOptions = Object.values(Role).map((role) => (
    <MenuItem key={role} value={role.toLowerCase()}>
      {role}
    </MenuItem>
  ));

  return (
    <Box padding={1}>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nr.</TableCell>
              <TableCell>Data zatrudnienia</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rola</TableCell>
              <TableCell>Usun</TableCell>
              <TableCell>Zmien</TableCell>
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
                    Usun
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CustomTable;