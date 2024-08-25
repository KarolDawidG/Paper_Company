import { useState } from "react";

interface SearchLogicProps<T> {
    data: T[];
}

export const useSearchLogic = <T extends Record<string, any>>({ data }: SearchLogicProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((item) =>
        Object.values(item).some((value) => {
            if (value == null) return false;
            return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    return {
        searchTerm,
        setSearchTerm,
        filteredData
    };
};

export default useSearchLogic;
