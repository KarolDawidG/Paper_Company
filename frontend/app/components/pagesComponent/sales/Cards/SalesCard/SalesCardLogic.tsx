import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form'; 

const SalesCardLogic = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [expanded, setExpanded] = useState(false);
  const [sales_id, setSalesId] = useState<string | null>(null);
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
    sales_id: "",
  });

  useEffect(() => {
    const idUser = localStorage.getItem('idUser');
    if (idUser) {
      setSalesId(idUser);
      setFormData(prevData => ({
        ...prevData,
        sales_id: idUser 
      }));
    }    
    
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmit = async() => {
    try {
    const response = await axiosInstance.post('/sales', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    notify(response.data);
    setFormData({
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
          sales_id: "",
        });
    } catch (error) {
      console.error('Request failed:', error);
      notify("Nie udalo sie przekazac danych");
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
    expanded,
    onSubmit,
    register,
    formState: { errors } 
  };
};

export default SalesCardLogic;
