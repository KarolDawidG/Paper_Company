import React, { useEffect, useState } from "react";
import {Box, CircularProgress, TablePagination} from "@mui/material";
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import usePaginationLogic from "@/app/components/utils/tableUtils/PaginationControl";
import useSearchLogic from "@/app/components/utils/tableUtils/SearchControl";
import useTranslation from "@/app/components/language/useTranslation";
import { Invoice } from "./interfaces/invoice";
import InvoicesTableContent from "./InvoicesTableContent";
import OrderDetailsModal from "./OrderDetailsModal";
const paymentStatuses = ["unpaid", "waiting", "paid", "overdue"];

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data: invoices });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get("/invoice");
      setInvoices(response.data.invoice);

      console.log(response.data.invoice)
    } catch (error) {
      console.error("Błąd przy pobieraniu faktur:", error);
      notify("Nie udało się pobrać faktur.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Invoice["payment_status"]) => {
    try {
      await axiosInstance.patch(`/invoice/${id}/status`, { status: newStatus });
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, payment_status: newStatus } : invoice
        )
      );
      notify("Zmieniono status faktury.");
    } catch (error) {
      console.error("Błąd przy zmianie statusu:", error);
      notify("Nie udało się zaktualizować statusu.");
    }
  };

  
  const handleShowOrderDetails = (orderId: string) => {
  setSelectedOrderId(orderId);
};

  const handleCloseOrderDetails = () => {
  setSelectedOrderId(null);
};

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading || !t.table) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>

      <InvoicesTableContent    
        page={page}
        rowsPerPage={rowsPerPage}    
        filteredData={filteredData}
        handleStatusChange={handleStatusChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        paymentStatuses={paymentStatuses}
        handleShowOrderDetails={handleShowOrderDetails}
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

      {selectedOrderId && (
        <OrderDetailsModal
            open={true}
            orderId={selectedOrderId}
            onClose={handleCloseOrderDetails}
            
        />
        )}


    </Box>
  );
};

export default InvoicesPage;
