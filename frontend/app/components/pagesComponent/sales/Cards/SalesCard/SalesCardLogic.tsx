import axiosInstance from "@/app/api/axiosInstance";
import React, { useState, useEffect } from "react";

const SalesCardLogic = () => {
  const [expanded, setExpanded] = useState(false);
  const [salesId, setSalesId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    imie: "",
    email: "",
    produkt: "",
    ilosc: "",
    miasto: "",
    ulica: "",
    nr_budynku: "",
    nr_mieszkania: "",
    kod: "",
    nazwa_firmy: "",
    salesId: "",
  });


  useEffect(() => {
    const idUser = localStorage.getItem('idUser');
    if (idUser) {
      setSalesId(idUser);
      setFormData(prevData => ({
        ...prevData,
        salesId: idUser 
      }));
    }    
    
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
    const response = await axiosInstance.post('http://localhost:3001/sales', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleChange = (field:string | number, value:string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  
  return {
    handleExpandClick,
    handleSubmit,
    handleChange,
    formData,
    expanded
  };
};

export default SalesCardLogic;
