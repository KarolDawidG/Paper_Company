import React, { useEffect, useState } from 'react';
import { User, UserData } from './UsersTable/TableInterfaces';
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
import { TableProps } from './UsersTable/TableInterfaces';
import { formatDate } from '../../helpers/formDate';
import axiosInstance from '@/app/api/axiosInstance';
import axios from 'axios';

const CustomTable: React.FC<TableProps> = () => {
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({});

  const filteredData = data.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UserData>('http://localhost:3001/users');
        setData(response.data.usersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRole = async (userId: string) => {
    try {
      const role = selectedRoles[userId] || 'user';
      await axiosInstance.put(`http://localhost:3001/admin/${userId}/${role}`);
      
      setData((prevData) => {
        const updatedData = prevData.map((user) =>
          user.id === userId ? { ...user, role: role } : user
        );
        return updatedData;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id:string) => {
    try {
      await axiosInstance.delete(`http://localhost:3001/admin/${id}`);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Box padding={1}>
      <Box marginBottom={2} display='flex' alignItems='center'>
        <Typography variant="h6" style={{ marginRight: '16px' }}>
          Wyszukaj użytkownika:
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

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
                <TableCell>{formatDate(user.created_at)}</TableCell>
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
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
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
