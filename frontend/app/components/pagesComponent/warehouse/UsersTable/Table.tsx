import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TablePagination, LinearProgress} from '@mui/material';
import { TablePropsProducts } from './TableInterfaces';
import TableLogic from './TableLogic';
import usePaginationLogic from '@/app/components/utils/tableUtils/PaginationControl';
import SearchBar from '@/app/components/utils/tableUtils/Search';
import useTranslation from '@/app/components/language/useTranslation';
import SetPageComponent from '@/app/components/utils/tableUtils/SetPageComponent';

const CustomTable: React.FC<TablePropsProducts> = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
  const {searchTerm, setSearchTerm, filteredData} = TableLogic();



    if (!t.table) {
      return <LinearProgress />;
    }


  return (
    <Box padding={1}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t.table.no}</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>Kategoria</TableCell>
              <TableCell>Cena</TableCell>
              <TableCell>Ilosc</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <SetPageComponent 
        page={page}
        setPage={setPage}
        sortedData={filteredData}
        rowsPerPage={rowsPerPage} 
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
    </Box>
  );
};

export default CustomTable;