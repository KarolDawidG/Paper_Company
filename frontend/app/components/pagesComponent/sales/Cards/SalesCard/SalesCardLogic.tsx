import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useState } from "react";
import { useForm } from 'react-hook-form'; 

const SalesCardLogic = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    cart_id: "",
    miasto: "",
    ulica: "",
    nr_budynku: "",
    nr_mieszkania: "",
    kod: "",
    nazwa_firmy: "",
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmit = async(data: Record<string, any>) => {
    const idClient = sessionStorage.getItem('clientId');
    try {

      if (!idClient) {
        notify("Najpierw wybierz klienta!");
        return;
      }
      const orderData = {
        ...data,
        client_id: idClient
      };

      const response = await axiosInstance.post('/sales', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      localStorage.setItem("order_id", response.data.order_id);
      notify("Dane klienta i adres dostawy, zostaly zapisane!");
      reset();
    } catch (error) {
      console.error('Request failed:', error);
      notify("Nie udało się przekazać danych!");
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
