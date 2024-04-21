import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ClientTable = ({ data, handleIdClient, handleDelete, handleOpenEditClient, selectedClientId }:any) => {
    return (
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
                    {data.map((client:any, index:any) => (
                        <TableRow key={client.id || index} sx={selectedClientId === (client.clientData && client.clientData.id) ? { backgroundColor: '#666666' } : {}}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{client.clientData?.first_name} {client.clientData?.second_name}</TableCell>
                            <TableCell>{client.clientData?.email}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleIdClient(client.clientData.id)}>
                                    Select
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleDelete(client.clientData.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleOpenEditClient(client.clientData.id, client.clientData.first_name, client.clientData.second_name, client.clientData.email)}>
                                    Update
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClientTable;
