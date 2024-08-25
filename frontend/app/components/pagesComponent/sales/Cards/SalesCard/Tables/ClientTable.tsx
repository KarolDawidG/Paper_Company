import React from "react";
import { Button, Table, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Box, LinearProgress} from '@mui/material';
import usePaginationLogic from '../../../../../utils/tableUtils/PaginationControl';
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import SearchBar from "../../../../../utils/tableUtils/Search";
import useSorting from "../../../../../utils/tableUtils/SortingControl";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SetPageComponent from "../../../../../utils/tableUtils/SetPageComponent";
import useTranslation from "@/app/components/language/useTranslation";

const ClientTable = ({ data, handleIdClient, handleDelete, handleOpenEditClient, selectedClientId }: any) => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data });
  const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting('email');
  const sortedData = stableSort(filteredData, getComparator(order, orderBy));
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.table) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t.table.no}</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={order}
                  onClick={(event) => handleRequestSort(event, 'email')}
                >
                  E-mail
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'first_name'}
                  direction={order}
                  onClick={(event) => handleRequestSort(event, 'first_name')}
                >
                  {t.table.first_name}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'second_name'}
                  direction={order}
                  onClick={(event) => handleRequestSort(event, 'second_name')}
                >
                  {t.table.second_name}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t.table.select}</TableCell>
              <TableCell>{t.table.delete}</TableCell>
              <TableCell>{t.table.update}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((client: any, index: number) => (
              <TableRow key={client.id || index} sx={{ backgroundColor: selectedClientId === client.id ? '#666666' : 'inherit' }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.first_name}</TableCell>
                <TableCell>{client.second_name}</TableCell>

                <TableCell>
                  <IconButton onClick={() => handleIdClient(client.id)} color="inherit">
                    {selectedClientId === client.id ? <CheckCircleOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />}
                  </IconButton>
                </TableCell>

                <TableCell>
                  <IconButton onClick={() => handleDelete(client.id)} color="inherit">
                    <HighlightOffOutlinedIcon />
                  </IconButton>
                </TableCell>

                <TableCell>
                  <Button onClick={() => handleOpenEditClient(client.id, client.first_name, client.second_name, client.email)}>{t.table.update}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SetPageComponent 
        page={page}
        setPage={setPage}
        sortedData={sortedData}
        rowsPerPage={rowsPerPage} 
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 50, { label: `${t.table.all}`, value: -1 }]}
        labelRowsPerPage={`${t.table.rows_per_page}:`}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ClientTable;