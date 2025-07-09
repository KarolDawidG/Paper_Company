import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  LinearProgress
} from '@mui/material';
import { formatDate } from '@/app/components/helpers/formDate';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import useTranslation from "@/app/components/language/useTranslation";
import { OrderTableContentProps } from './Interfaces/OrderTableContentProps';

const OrderTableContent: React.FC<OrderTableContentProps> = ({
  data,
  page,
  rowsPerPage,
  filteredData,
  handleDeleteOrder,
  handleOpenDetails,
  searchTerm,
  setSearchTerm,
  sortDirection,
  sortColumn,
  toggleSort,
}) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.table) {
    return <LinearProgress />;
  }

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    }
    return ' ⬍';
  };

  return (
    <Box padding={1}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableContainer component={Paper}>
        <Table size="small" aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell>{t.table.no}</TableCell>

              <TableCell onClick={() => toggleSort('company_name')} sx={{ cursor: 'pointer' }}>
                {t.table.company_name}
                {getSortIcon('company_name')}
              </TableCell>

              <TableCell>{t.table.order_id}</TableCell>

              <TableCell onClick={() => toggleSort('created_at')} sx={{ cursor: 'pointer' }}>
                {t.table.order_date}
                {getSortIcon('created_at')}
              </TableCell>

              <TableCell>{t.table.delete}</TableCell>
              <TableCell>{t.table.details}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredData
            ).map((order, index) => (
              <TableRow key={order.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{order.company_name}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>

                <TableCell>
                  <Button onClick={() => handleDeleteOrder(order.id)}>
                    {t.table.delete}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button onClick={() => handleOpenDetails(order)}>
                    {t.table.show}
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

export default OrderTableContent;
