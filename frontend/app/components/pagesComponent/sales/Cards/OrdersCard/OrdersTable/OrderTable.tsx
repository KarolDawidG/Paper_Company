import React, { useCallback, useEffect, useState } from 'react';
import OrderDetailsModal from './OrderDetailsModal';
import OrderTableContent from './OrderTableContent';
import { LinearProgress, Box, TablePagination } from '@mui/material';
import axiosInstance from '@/app/api/axiosInstance';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import { notify } from '@/app/components/notification/Notify';
import useTranslation from "@/app/components/language/useTranslation";
import useTranslationStatus from '@/app/components/language/useTranslationStatus';
import { Order } from './Interfaces/InterfaceOrder';

const OrderTable: React.FC = () => {
  const [data, setData] = useState<Order[]>([]);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data });
  const [selectedOrderAddress, setSelectedOrderAddress] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedClientId, setClientId] = useState<string | null>(null);
  
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const isTranslationLoaded = useTranslationStatus(currentLocale);

  const fetchData = useCallback(async () => {
    const idUser = localStorage.getItem('idUser'); //id zalogowanego uzytkownika
    try {
      const response = await axiosInstance.get('/sales', { params: { idUser } });
      // console.log(response.data.ordersList);
      // only orders.status = 'pending'
      setData(response.data.ordersList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteOrder = async (id: string) => {
    try {
      await axiosInstance.delete(`/sales/${id}`);
      fetchData(); 
      if (isTranslationLoaded) {
        notify(`${t.notification.order_delete}`);
      }
    } catch (error: any) {
      console.error(error);
      if (isTranslationLoaded) {
        notify(`${t.notification.order_delete_error}`);
      }
    }
  };
  
  const handleOpenDetails = (order: Order) => {
    //console.log("Selected order:", order);
    setSelectedOrderAddress(order.client_address_id);
    setSelectedOrder(order.id);
    setClientId(order.client_id);
  };

  const handleCloseDetails = () => {
    setSelectedOrderAddress(null);
    setSelectedOrder(null);
  };

  if (!t.table) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <OrderTableContent
        data={data}
        page={page}
        rowsPerPage={rowsPerPage}
        filteredData={filteredData}
        handleDeleteOrder={handleDeleteOrder}
        handleOpenDetails={handleOpenDetails}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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

      {(selectedOrderAddress && selectedOrder && selectedClientId) && (
        <OrderDetailsModal
          open={true}
          onClose={handleCloseDetails}
          orderAdressId={selectedOrderAddress}
          orderId={selectedOrder}
          clientId={selectedClientId}
        />
      )}
    </Box>
  );
};

export default OrderTable;