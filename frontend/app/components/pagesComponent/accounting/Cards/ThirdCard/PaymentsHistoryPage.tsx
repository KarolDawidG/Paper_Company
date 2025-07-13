import React, { useEffect, useState } from "react";
import { Box, CircularProgress, TablePagination, Typography } from "@mui/material";
import axiosInstance from "@/app/api/axiosInstance";
import usePaginationLogic from "@/app/components/utils/tableUtils/PaginationControl";
import useSearchLogic from "@/app/components/utils/tableUtils/SearchControl";
import useSorting from "@/app/components/utils/tableUtils/SortingControl";
import SearchBar from "@/app/components/utils/tableUtils/Search";
import useTranslation from "@/app/components/language/useTranslation";
import { formatDate } from "@/app/components/helpers/formDate";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from "@mui/material";

interface PaymentRecord {
  invoice_number: string;
  created_at: string;
  payment_date: string | null;
  payment_status: string;
  company_name: string;
  total: number;
}

const PaymentsHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting("created_at");
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data: payments || [] });

  const t = useTranslation(localStorage.getItem("locale") || "en");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/invoice/history");
        setPayments(response.data.history);
        console.log(response)
      } catch (error) {
        console.error("Błąd przy pobieraniu historii płatności:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const sortedData = stableSort(filteredData, getComparator(order, orderBy));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>Historia płatności</Typography>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "invoice_number"}
                  direction={orderBy === "invoice_number" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "invoice_number")}
                >
                  Numer faktury
                </TableSortLabel>
              </TableCell>
              <TableCell>Klient</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "created_at"}
                  direction={orderBy === "created_at" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "created_at")}
                >
                  Data wystawienia
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "payment_date"}
                  direction={orderBy === "payment_date" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "payment_date")}
                >
                  Data płatności
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Kwota</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedData
            ).map((record) => (
              <TableRow key={record.invoice_number}>
                <TableCell>{record.invoice_number}</TableCell>
                <TableCell>{record.company_name}</TableCell>
                <TableCell>{formatDate(record.created_at)}</TableCell>
                <TableCell>{record.payment_date ? formatDate(record.payment_date) : "-"}</TableCell>
                <TableCell>{record.payment_status}</TableCell>
                <TableCell>{record.total.toFixed(2)} PLN</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: t.table?.all || "Wszystkie", value: -1 }]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t.table?.rows_per_page || "Wierszy na stronę"}
      />
    </Box>
  );
};

export default PaymentsHistoryPage;
