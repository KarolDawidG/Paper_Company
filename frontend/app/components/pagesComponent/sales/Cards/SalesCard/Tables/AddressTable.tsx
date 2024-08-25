import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, LinearProgress, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { DisableButton } from "@/app/components/layout/Buttons";
import BaseDialog from "@/app/components/utils/BaseDialog";
import SearchBar from "../../../../../utils/tableUtils/Search";
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import useSorting from "@/app/components/utils/tableUtils/SortingControl";
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import useTranslation from "@/app/components/language/useTranslation";
import usePaginationLogic from "@/app/components/utils/tableUtils/PaginationControl";
import SetPageComponent from "@/app/components/utils/tableUtils/SetPageComponent";

export const AddressTable = ({ selectedAddressId, addressData, handleDeleteAddress, handleIdAddress, handleOrder, handleClearAddresSelect}:any) => {
    const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
    const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data: addressData });
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState(null);
    const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting('miasto');
    const sortedData = stableSort(filteredData, getComparator(order, orderBy));
    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    
    const handleOpenDialog = (id:any) => {
        setCurrentAddressId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        handleDeleteAddress(currentAddressId);
        setOpenDialog(false);
    };

    if (!t.table) {
        return <LinearProgress />;
      }

    return (
    <Box>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <CardContent>
            <Typography variant="h6">{t.address.table_of_addresses}</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t.table.no}</TableCell>
                                
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'nazwa_firmy'}
                                        direction={order}
                                        onClick={(event) => handleRequestSort(event, 'nazwa_firmy')}
                                        >
                                        {t.table.company_name}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'miasto'}
                                        direction={order}
                                        onClick={(event) => handleRequestSort(event, 'miasto')}
                                        >
                                        {t.table.city}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>{t.table.select}</TableCell>
                                <TableCell>{t.table.delete}</TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody>

                            {paginatedData.map((address:any, index:number) => (
                                    <TableRow key={index} sx={{ backgroundColor: selectedAddressId === address.id ? '#666666' : 'inherit' }}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{address.nazwa_firmy}</TableCell>
                                        <TableCell>{address.miasto}</TableCell>

                                        <TableCell>
                                            <IconButton onClick={() => handleIdAddress(address.id)} color="inherit">
                                                {selectedAddressId === address.id ? <CheckCircleOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />}
                                            </IconButton>
                                        </TableCell>

                                        <TableCell>
                                            <IconButton onClick={() => handleOpenDialog(address.id)} color="inherit">
                                                <HighlightOffOutlinedIcon />
                                            </IconButton>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                    </Table>
                </TableContainer>
                    
        </CardContent>
            <Typography>
                {t.address.confirm_message}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                <DisableButton onClick={() => handleOrder()} disabled={!selectedAddressId}>
                    {t.table.create}
                </DisableButton>
                <DisableButton onClick={() => handleClearAddresSelect()} disabled={!selectedAddressId}>
                    {t.table.clear}
                </DisableButton>
            </Box>
                
            <BaseDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} title="Confirm Deletion" confirmText="Delete" cancelText="Cancel">
                {t.address.confirm_delete_address}
            </BaseDialog>

            <SetPageComponent 
                page={page}
                setPage={setPage}
                sortedData={sortedData}
                rowsPerPage={rowsPerPage} 
            />

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: `${t.table.all}`, value: -1 }]}
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