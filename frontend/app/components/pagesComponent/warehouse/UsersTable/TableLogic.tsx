import React, { useEffect, useState } from 'react';
import { ProductsData,  TablePropsProducts, Products } from './TableInterfaces';
import axiosInstance from '@/app/api/axiosInstance';

const TableLogic = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredData = data.filter((id) =>
    Object.values(id).some((value) =>
      value != null &&
      (typeof value === 'string' || typeof value === 'number') &&
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 27.8.7: Magazyn pobiera dane przez axiosInstance, bo endpoint jest już chroniony tokenem i rolą.
        const response = await axiosInstance.get<any>('http://localhost:3001/warehouse/products');
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};

export default TableLogic;
