import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, LinearProgress, TableSortLabel, Typography, Select, MenuItem} from '@mui/material';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import useTranslation from "@/app/components/language/useTranslation";
import useSorting from '@/app/components/utils/tableUtils/SortingControl';
import { Invoice, InvoiceProps } from './interfaces/invoice';
import { formatDate } from '@/app/components/helpers/formDate';



const InvoicesTableContent: React.FC<InvoiceProps> = ({
  filteredData,
  page,
  rowsPerPage,
  handleStatusChange,
  searchTerm,
  setSearchTerm,
  paymentStatuses,
  handleShowOrderDetails
}) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting('invoice_number');
  const sortedData = stableSort(filteredData, getComparator(order, orderBy));

  if (!t.table) {
    return <LinearProgress />;
  }


  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lista faktur
      </Typography>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableContainer component={Paper}>
        <Table size="small" aria-label="invoice table">
          <TableHead>
            <TableRow>
              <TableCell>Nr</TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "invoice_number"}
                  direction={orderBy === "invoice_number" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "invoice_number")}
                >
                  Numer faktury
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "created_at"}
                  direction={orderBy === "created_at" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "created_at")}
                >
                  Data utworzenia
                </TableSortLabel>
              </TableCell>

              <TableCell>ID zamówienia</TableCell>
              <TableCell>Status płatności</TableCell>
              <TableCell>Data płatności</TableCell>
              <TableCell>Szczegóły</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedData
            ).map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{formatDate(invoice.created_at)}</TableCell>
                <TableCell>{invoice.order_id}</TableCell>
                <TableCell>
                  <Select
                    value={invoice.payment_status}
                    onChange={(e) =>
                      handleStatusChange(invoice.id, e.target.value as Invoice["payment_status"])
                    }
                    size="small"
                  >
                    {paymentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{invoice.payment_date ? formatDate(invoice.payment_date) : "—"}</TableCell>
                <TableCell>
                    <Button onClick={() => handleShowOrderDetails(invoice.order_id)}>
                        Szczegóły
                    </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>




    </Box>
  );
};

export default InvoicesTableContent;
