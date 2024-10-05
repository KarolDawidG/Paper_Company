import React from "react";
import { Typography, TextField, Box, LinearProgress} from '@mui/material';
import useTranslation from "@/app/components/language/useTranslation";

const PaginationControls = ({ page, setPage, sortedData, rowsPerPage }: any) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

    if (!t.table) {
      return <LinearProgress />;
    }

  return (
    <Box sx={{ display: 'flex', marginTop:2, justifyContent: 'space-between', marginBottom: 2 }}>
      <Typography>{t.table.current_page}: {page+1} / {Math.ceil(sortedData.length/rowsPerPage)}</Typography>
      <form>
        <TextField
          id="outlined-number"
          label={`${t.table.page}`}
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
