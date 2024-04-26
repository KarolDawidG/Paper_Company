import React from "react";
import { Typography, TextField, Box} from '@mui/material';

const PaginationControls = ({ page, setPage, sortedData, rowsPerPage }: any) => {
  return (
    <Box sx={{ display: 'flex', marginTop:2, justifyContent: 'space-between', marginBottom: 2 }}>
      <Typography>Current page: {page+1} / {Math.ceil(sortedData.length/rowsPerPage)}</Typography>
      <form>
        <TextField
          id="outlined-number"
          label="Page"
          type="number"
          InputLabelProps={{ shrink: true }}
          onChange={(event: any) => {
            const pageNumber = parseInt(event.target.value, 10);
            if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= Math.ceil(sortedData.length / rowsPerPage)) {
              setPage(pageNumber-1);
            }
          }}
          inputProps={{ min: 1, max: Math.ceil(sortedData.length / rowsPerPage) }}
        />
      </form>
    </Box>
  );
};

export default PaginationControls;
