import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import {
    Box,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from '@mui/material';
import axiosInstance from "@/app/api/axiosInstance";

export const ClientsData = () => {
    const [data, setData] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    const handleIdClient = (clientId: number) => {
        setSelectedClientId(clientId);
        localStorage.setItem('clientId', clientId.toString());
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/client');
                setData(response.data.clientList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Box>
            <Box noValidate sx={{ mt: 1 }}>
                <Typography>
                    Select client:
                </Typography>

                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Select</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((client, index) => (
                                    <TableRow key={client.id} sx={selectedClientId === client.clientData.id ? { backgroundColor: '#666666' } : {}}>
                                        <TableCell>{index+1}</TableCell>
                                        <TableCell>{client.clientData.first_name} {client.clientData.second_name}</TableCell>
                                        <TableCell>{client.clientData.email}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleIdClient(client.clientData.id)}>
                                                Wybierz
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Box>
        </Box>
    );
};
