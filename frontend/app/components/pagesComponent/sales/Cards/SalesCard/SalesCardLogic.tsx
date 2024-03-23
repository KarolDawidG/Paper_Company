import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form'; 

const SalesCardLogic = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [expanded, setExpanded] = useState(false);
  const [account_id, setAccountId] = useState<string | null>(null);
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
    account_id: "",
  });

  useEffect(() => {
    const idUser = localStorage.getItem('idUser');
    if (idUser) {
      setAccountId(idUser);
    }    
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmit = async(data: Record<string, any>) => {
    try {
      const orderData = {
        ...data,
        account_id: account_id
      };
      
      const response = await axiosInstance.post('/sales', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      notify(response.data);
      reset();
    } catch (error) {
      console.error('Request failed:', error);
      notify("Nie udało się przekazać danych");
    }
  };

  const handleChange = (field:any, value:any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
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
