import React, { useEffect, useState } from 'react';
import { User, UserData } from './TableInterfaces';
import axiosInstance from '@/app/api/axiosInstance';
import axios from 'axios';

const TableLogic = () => {
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({});

  const filteredData = data.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UserData>('http://localhost:3001/admin');
        setData(response.data.usersList);
        console.log(response.data.usersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
      setData(data.filter((user) => user.id !== id)); 
    } catch (error: any) {
      console.error(error);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedRoles, setSelectedRoles,
    handleChangeRole,
    handleDeleteUser,
    filteredData,
    };
};

export default TableLogic;
