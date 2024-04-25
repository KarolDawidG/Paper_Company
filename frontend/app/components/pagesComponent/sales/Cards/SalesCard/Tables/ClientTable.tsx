import React from "react";
import {
  Button, Table, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Box
} from '@mui/material';
import { usePaginationLogic } from '../../../../../utils/tableUtils/PaginationControl';
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import SearchBar from "../../../../../utils/tableUtils/Search";
import useSorting from "../../../../../utils/tableUtils/SortingControl";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const ClientTable = ({ data, handleIdClient, handleDelete, handleOpenEditClient, selectedClientId }: any) => {
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePaginationLogic();
  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data });
  const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting('email');
  const sortedData = stableSort(filteredData, getComparator(order, orderBy));

  return (
    <Box>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={order}
                  onClick={(event) => handleRequestSort(event, 'email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'first_name'}
                  direction={order}
                  onClick={(event) => handleRequestSort(event, 'first_name')}
                >
                  First Name
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'second_name'}
                  direction={order}
                  onClick={(event) => handleRequestSort(event, 'second_name')}
                >
                  Second Name
                </TableSortLabel>
              </TableCell>

              <TableCell>Select</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((client: any, index: number) => (
              <TableRow key={client.id || index} sx={{ backgroundColor: selectedClientId === client.id ? '#666666' : 'inherit' }}>
                <TableCell>{index + 1}</TableCell>
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
                  <Button onClick={() => handleOpenEditClient(client.id, client.first_name, client.second_name, client.email)}>Update</Button>
                </TableCell>
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
    </Box>
  );
};

export default ClientTable;
