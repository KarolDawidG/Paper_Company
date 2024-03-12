import { formatDate } from "@/app/components/helpers/formDate";
import React, { useState, useEffect } from "react";

const SalesCardLogic = () => {
  const [expanded, setExpanded] = useState(false);
  const [salesId, setSalesId] = useState<string | null>(null);
  const [transactionDate, setTransactionDate] = useState<string | any>();
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
    nazwa_frimy: "",
    salesId: "",
    transactionDate:"",
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

    const currendDate = new Date().toISOString().slice(0, 16);
    const date = formatDate(currendDate);
    if (date) {
      setTransactionDate(date);
      setFormData(prevData => ({
        ...prevData,
        transactionDate: date 
      }));
    }
    
    
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
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
