import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form'; 

const SalesCardLogic = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [expanded, setExpanded] = useState(false);
  const [client_id, setClient_id] = useState<string | null>(null);
  const [cart_id, setCart_id] = useState<string | null>(null);
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

  useEffect(() => {
    const test_id = 'e270465a-e9fc-11ee-b89f-d8bbc1db3b34';
    const idUser = localStorage.getItem('idUser');
    if (idUser) {
      setClient_id(test_id);
    }    
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmit = async(data: Record<string, any>) => {
    try {
      console.log("Dane do wysłania na backend:", {
        ...data,
        client_id: client_id
      });

      const orderData = {
        ...data,
        client_id: client_id
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
