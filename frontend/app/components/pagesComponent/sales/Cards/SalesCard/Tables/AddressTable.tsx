import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, TablePagination } from '@mui/material';
import { DisableButton } from "@/app/components/layout/Buttons";
import BaseDialog from "@/app/components/utils/BaseDialog";
import { usePaginationLogic } from './PaginationControl';
import SearchBar from "./Search";
import useSearchLogic from "./SearchControl";

export const AddressTable = ({ selectedAddressId, addressData, handleDeleteAddress, handleIdAddress, handleOrder, handleClearAddresSelect}:any) => {
    const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = usePaginationLogic();
    const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data: addressData });
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState(null);

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
                                <TableCell>Nazwa Firmy</TableCell>
                                <TableCell>Miasto</TableCell>
                                <TableCell>Select</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody>

                            {(rowsPerPage > 0 ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData).map((address:any, index:number) => (
                                    <TableRow key={index} sx={{ backgroundColor: selectedAddressId === address.Data.id ? '#666666' : 'inherit' }}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{address.Data.nazwa_firmy}</TableCell>
                                        <TableCell>{address.Data.miasto}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleIdAddress(address.Data.id)}>
                                                Select
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleOpenDialog(address.Data.id)}>
                                                Delete
                                            </Button>
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
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
   );
};
