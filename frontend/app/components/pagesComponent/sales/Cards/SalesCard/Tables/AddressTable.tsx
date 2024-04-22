import React from "react";
import Typography from '@mui/material/Typography';
import { Box, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export const AddressTable = ({ selectedAddressId, addressData, handleDeleteAddress, handleIdAddress, handleOrder, handleClearAddresSelect}:any) => {
    return (
            <Box>
                <CardContent>
                    <Box>
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
                                    {addressData.map((address:any, index:number) => (
                                        <TableRow key={index} sx={{ backgroundColor: selectedAddressId === address.addressData.id ? '#666666' : 'inherit' }}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{address.addressData.nazwa_firmy}</TableCell>
                                            <TableCell>{address.addressData.miasto}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleIdAddress(address.addressData.id)}>
                                                    Select
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleDeleteAddress(address.addressData.id)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </CardContent>
                <Box>
                <Typography>
                    Chcesz stworzyc zamowienie dla wybranych danych?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Button onClick={() => handleOrder()} disabled={!selectedAddressId}   sx={{backgroundColor: selectedAddressId ? '#1976d2' : '#ccc', color: '#fff', '&:hover': { backgroundColor: selectedAddressId ? '#1565c0' : '#ccc',}, '&:disabled': { backgroundColor: '#ccc', color: '#666' }}}>
                        Tworz
                    </Button>

                    <Button onClick={() => handleClearAddresSelect()} disabled={!selectedAddressId}   sx={{backgroundColor: selectedAddressId ? '#1976d2' : '#ccc', color: '#fff', '&:hover': { backgroundColor: selectedAddressId ? '#1565c0' : '#ccc',}, '&:disabled': { backgroundColor: '#ccc', color: '#666' }}}>
                        Czysc
                    </Button>
                </Box>
                </Box>
            </Box>
    );
};
