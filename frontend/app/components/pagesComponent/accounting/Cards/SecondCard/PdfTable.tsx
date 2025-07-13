import React, { useCallback, useEffect, useState } from 'react';
import { LinearProgress, Box, TablePagination } from '@mui/material';
import axiosInstance from '@/app/api/axiosInstance';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import useSearchLogic from '@/app/components/utils/tableUtils/SearchControl';
import useTranslation from '@/app/components/language/useTranslation';
import useTranslationStatus from '@/app/components/language/useTranslationStatus';
import { notify } from '@/app/components/notification/Notify';
import PdfTableContent from './PdfTableContent';
import PdfDetailsModal from './PdfDetailsModal';

const PdfTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | {
    orderId: string;
    orderAdressId: string;
    clientId: string;
  }>(null);

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data });
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const isTranslationLoaded = useTranslationStatus(currentLocale);

  const fetchData = useCallback(async () => {
    const idUser = localStorage.getItem('idUser');
    try {
      const response = await axiosInstance.get('/sales', { params: { idUser } });

      const pendingOrders = response.data.ordersList.filter((order: any) => order.payment_status === 'unpaid');
      setData(pendingOrders);
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
      if (isTranslationLoaded) notify(t.notification.order_delete);
    } catch (error) {
      console.error(error);
      if (isTranslationLoaded) notify(t.notification.order_delete_error);
    }
  };

  const handleShowDetails = (order: any) => {
    setSelectedOrder({
      orderId: order.id,
      orderAdressId: order.client_address_id,
      clientId: order.client_id,
    });
    setModalOpen(true);
  };

  if (!t.table) return <LinearProgress />;

  return (
    <Box>
      <PdfTableContent
        page={page}
        rowsPerPage={rowsPerPage}
        filteredData={filteredData}
        handleDeleteOrder={handleDeleteOrder}
        handleShowDetails={handleShowDetails}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: t.table.all, value: -1 }]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t.table.rows_per_page}
      />

      {selectedOrder && (
        <PdfDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          orderId={selectedOrder.orderId}
          orderAdressId={selectedOrder.orderAdressId}
          clientId={selectedOrder.clientId}
          onSuccess={fetchData} 
        />
      )}
    </Box>
  );
};

export default PdfTable;
