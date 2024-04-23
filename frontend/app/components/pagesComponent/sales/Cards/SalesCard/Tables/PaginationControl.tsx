import { useState } from "react";

interface PaginationLogicProps {
    data: any[];
    addressData?: any; // Dodanie tej linii, jeśli addressData jest opcjonalne
}

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
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage
    };
};

export default usePaginationLogic;
