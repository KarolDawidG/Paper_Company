import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { formatDate } from '@/app/components/helpers/formDate';

const OrderTable: React.FC<any> = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  useEffect(() => {

    const fetchData = async () => {
      const idUser:any = localStorage.getItem('idUser');
      try {
        const response = await axios.get('http://localhost:3001/sales', { params: { idUser } });
        setData(response.data.ordersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
    fetchData();
  }, []);

const filteredData = data.filter((order) =>
  Object.values(order.orderData).some((value:any) =>
    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
);

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
  
  return (
    <Box padding={1}>
      <Box marginBottom={2} display='flex' alignItems='center'>
        <Typography variant="h6" style={{ marginRight: '16px' }}>
          Wyszukaj zamowienie:
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
              <TableCell>Imie</TableCell>
              <TableCell>Nazwa firmy</TableCell>
              <TableCell>Produkt</TableCell>
              <TableCell>Data zamowienia</TableCell>
              <TableCell>Usun</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((order, index) => (
              <TableRow key={order.orderData.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{order.orderData.imie}</TableCell>
                <TableCell>{order.orderData.nazwa_firmy}</TableCell>
                <TableCell>{order.orderData.produkt}</TableCell>
                <TableCell>{formatDate(order.orderData.created_at)}</TableCell>

                <TableCell>
                  <Button>
                    Usun
                  </Button>
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

export default OrderTable;
