import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Box, LinearProgress, TableSortLabel
} from '@mui/material';
import { formatDate } from '@/app/components/helpers/formDate';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import useTranslation from "@/app/components/language/useTranslation";
import useSorting from '@/app/components/utils/tableUtils/SortingControl';

const PdfTableContent: React.FC<any> = ({
  filteredData,
  page,
  rowsPerPage,
  handleDeleteOrder,
  handleShowDetails,
  searchTerm,
  setSearchTerm
}) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting('company_name');
  const sortedData = stableSort(filteredData, getComparator(order, orderBy));

  if (!t.table) {
    return <LinearProgress />;
  }

  return (
    <Box padding={1}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableContainer component={Paper}>
        <Table size="small" aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>{t.table.no}</TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'company_name'}
                  direction={orderBy === 'company_name' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'company_name')}
                >
                  {t.table.company_name}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'id')}
                >
                  {t.table.order_id}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'created_at'}
                  direction={orderBy === 'created_at' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'created_at')}
                >
                  {t.table.order_date}
                </TableSortLabel>
              </TableCell>

              <TableCell>{t.table.status}</TableCell>
              <TableCell>{t.table.delete}</TableCell>
              <TableCell>{t.table.details}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedData
            ).map((order, index) => (
              <TableRow key={order.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{order.company_name}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.status}</TableCell>

                <TableCell>
                  <Button onClick={() => handleDeleteOrder(order.id)}>
                    {t.table.delete}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button onClick={() => handleShowDetails(order)}>
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

export default PdfTableContent;
