import React, { useEffect, useState } from 'react';
import { User, UserData } from './TableInterfaces';
import axiosInstance from '@/app/api/axiosInstance';
import axios from 'axios';

const TableLogic = () => {
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({});

  const filteredData = data.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UserData>('http://localhost:3001/users');
        setData(response.data.usersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRole = async (userId: string) => {
    try {
      const role = selectedRoles[userId] || 'user';
      await axiosInstance.put(`http://localhost:3001/admin/${userId}/${role}`);
      
      setData((prevData) => {
        const updatedData = prevData.map((user) =>
          user.id === userId ? { ...user, role: role } : user
        );
        return updatedData;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id:string) => {
    try {
      await axiosInstance.delete(`http://localhost:3001/admin/${id}`);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    page,
    rowsPerPage,
    selectedRoles, setSelectedRoles,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeRole,
    handleDeleteUser,
    filteredData,
    };
};

export default TableLogic;
