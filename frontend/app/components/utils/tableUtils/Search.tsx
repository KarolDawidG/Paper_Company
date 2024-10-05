import React from 'react';
import { Box, LinearProgress, TextField, Typography } from '@mui/material';
import useTranslation from "@/app/components/language/useTranslation";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);

    if (!t.table) {
        return <LinearProgress />;
      }
      
    return (
        <Box marginBottom={2} display='flex' alignItems='center'>
            <Typography variant="h6" style={{ marginRight: '16px' }}>
                {t.table.search}:
            </Typography>
            <TextField
                label={`${t.table.search}`}
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Box>
    );
};

export default SearchBar;
