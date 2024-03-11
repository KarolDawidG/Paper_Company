import React, { useState } from "react";

const SalesCardLogic = () => {
  const [expanded, setExpanded] = useState(false);
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
  });
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
