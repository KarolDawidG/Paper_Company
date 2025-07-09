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
  const [sortColumn, setSortColumn] = useState<'company_name' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const isTranslationLoaded = useTranslationStatus(currentLocale);
 


  const fetchData = useCallback(async () => {
    const idUser = localStorage.getItem('idUser');
    try {
      const response = await axiosInstance.get('/sales', { params: { idUser } });
      // console.log(response.data.ordersList);
      // only orders.status = 'pending'
      setData(response.data.ordersList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []); 

  const getSortedData = () => {
    return [...filteredData].sort((a, b) => {
      const valA = sortColumn === 'created_at'
        ? new Date(a.created_at).getTime()
        : a.company_name.toLowerCase();

      const valB = sortColumn === 'created_at'
        ? new Date(b.created_at).getTime()
        : b.company_name.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };



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
        filteredData={getSortedData()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleDeleteOrder={handleDeleteOrder}
        handleOpenDetails={handleOpenDetails}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        setSortColumn={setSortColumn}
        setSortDirection={setSortDirection}
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
