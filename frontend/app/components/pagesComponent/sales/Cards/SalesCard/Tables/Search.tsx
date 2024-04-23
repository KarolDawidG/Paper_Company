import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <Box marginBottom={2} display='flex' alignItems='center'>
            <Typography variant="h6" style={{ marginRight: '16px' }}>
                Search:
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Box>
    );
};

export default SearchBar;
