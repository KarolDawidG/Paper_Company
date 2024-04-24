import React, { useState } from "react";
import { Button, TextField, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { usePaginationLogic } from '../../../../../utils/tableUtils/PaginationControl';
import useSearchLogic from "../../../../../utils/tableUtils/SearchControl";
import SearchBar from "../../../../../utils/tableUtils/Search";

const ClientTable = ({ data, handleIdClient, handleDelete, handleOpenEditClient, selectedClientId }:any) => {
    const {
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage
    } = usePaginationLogic();

    const {
        searchTerm,
        setSearchTerm,
        filteredData
    } = useSearchLogic({ data });

    return (
    <Box>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Select</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Update</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                {(rowsPerPage > 0 ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData).map((client: any, index: any) => (                        
                        <TableRow key={client.id || index} sx={selectedClientId === (client && client.id) ? { backgroundColor: '#666666' } : {}}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{client?.first_name} {client?.second_name}</TableCell>
                            <TableCell>{client?.email}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleIdClient(client.id)}>
                                    Select
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleDelete(client.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleOpenEditClient(client.id, client.first_name, client.second_name, client.email)}>
                                    Update
                                </Button>
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
