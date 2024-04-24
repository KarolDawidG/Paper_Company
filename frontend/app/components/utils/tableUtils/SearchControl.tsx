import { useState } from "react";

interface SearchLogicProps {
    data: any[];
}

export const useSearchLogic = ({ data }: SearchLogicProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((item:any) =>
        Object.values(item).some((value:any) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    return {
        searchTerm,
        setSearchTerm,
        filteredData
    };
};

export default useSearchLogic;
