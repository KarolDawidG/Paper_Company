import { useState } from "react";

export const usePaginationLogic = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return {
        page,
        setPage,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage
    };
};

export default usePaginationLogic;
