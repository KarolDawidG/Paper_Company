import React, { useEffect, useState } from 'react';
import OrderDetailsModal from './OrderDetailsModal';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Typography, TablePagination, Button} from '@mui/material';
import { formatDate } from '@/app/components/helpers/formDate';
import axiosInstance from '@/app/api/axiosInstance';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import { notify } from '@/app/components/notification/Notify';

const OrderTable: React.FC<any> = () => {
  const [data, setData] = useState<any[]>([]);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const idUser:any = localStorage.getItem('idUser');
      try {
        const response = await axiosInstance.get('/sales', { params: { idUser } });
        setData(response.data.ordersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
    fetchData();
  }, []);

  const handleDeleteOrder = async (id:string) => {
    try {
      await axiosInstance.delete(`/sales/${id}`);
      setData(data.filter((order) => order.id !== id));
      notify('Usuwanie zakonczone sukcesem');
    } catch (error: any) {
      console.error(error);
      notify('Nie mozna usunac procedowanego zamowienia!');
    }
  };
  
  const handleOpenDetails = (order: any) => {
   setSelectedOrder(order.client_address_id);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <Box padding={1}>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nr.</TableCell>
              <TableCell>Id klienta</TableCell>
              <TableCell>Id zamowienia</TableCell>
              <TableCell>Data zamowienia</TableCell>
              <TableCell>Usun</TableCell>
              <TableCell>Szczegoly</TableCell>
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
              <TableRow key={order.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{order.client_id}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>

                <TableCell>
                  <Button onClick={() => handleDeleteOrder(order.id)}>
                    Usun
                  </Button>
                </TableCell>

                <TableRow>
                  <Button key={order.id} onClick={() => handleOpenDetails(order)}>
                    Wyswietl
                  </Button>
                </TableRow>

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

      {(selectedOrder ) && (
        <OrderDetailsModal
          open={true}
          onClose={handleCloseDetails}
          order={selectedOrder}
        />
      )}

    </Box>
  );
};

export default OrderTable;