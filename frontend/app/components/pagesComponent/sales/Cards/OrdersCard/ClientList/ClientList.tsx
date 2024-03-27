import React from 'react';
import { Box, Typography } from '@mui/material';

const ClientList = () => {
    const clientList = {
        1: {
            name: 'Dawid',
            secondname: 'Iks',
            email: 'xxxx@pw.pl'
        },
        2: {
            name: 'Jan',
            secondname: 'Kowalski',
            email: 'jan@example.com'
        },
        3: {
            name: 'Jan',
            secondname: 'Kowalski',
            email: 'jan@example.com'
        }
    };

    return (
        <Box padding={1}>
            <Typography variant="h4" gutterBottom>
                Client List
            </Typography>
            <ul>
                {Object.values(clientList).map((client, index) => (
                    <li key={index}>
                        {`${client.name} ${client.secondname} - ${client.email}`}
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default ClientList;
