import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { DisableButton } from "@/app/components/layout/Buttons";
import BaseDialog from "@/app/components/utils/BaseDialog";
import { usePaginationLogic } from '../../../../../utils/tableUtils/PaginationControl';
import SearchBar from "../../../../../utils/tableUtils/Search";
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import useSorting from "@/app/components/utils/tableUtils/SortingControl";
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

export const AddressTable = ({ selectedAddressId, addressData, handleDeleteAddress, handleIdAddress, handleOrder, handleClearAddresSelect}:any) => {
    const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
    const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data: addressData });
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState(null);
    const { order, orderBy, handleRequestSort, stableSort, getComparator } = useSorting('miasto');
    const sortedData = stableSort(filteredData, getComparator(order, orderBy));
    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

    return (
    <Box>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <CardContent>
            <Typography variant="h6">Tabela adresow</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'nazwa_firmy'}
                                        direction={order}
                                        onClick={(event) => handleRequestSort(event, 'nazwa_firmy')}
                                        >
                                        Nazwa Firmy
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'miasto'}
                                        direction={order}
                                        onClick={(event) => handleRequestSort(event, 'miasto')}
                                        >
                                        Miasto
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>Select</TableCell>
                                <TableCell>Delete</TableCell>
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
                Chcesz stworzyc zamowienie dla wybranych danych?
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                <DisableButton onClick={() => handleOrder()} disabled={!selectedAddressId}>
                    Tworz
                </DisableButton>
                <DisableButton onClick={() => handleClearAddresSelect()} disabled={!selectedAddressId}>
                    Czysc
                </DisableButton>
            </Box>
                
            <BaseDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} title="Confirm Deletion" confirmText="Delete" cancelText="Cancel">
                Are you sure you want to delete this address? This action cannot be undone.
            </BaseDialog>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
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