import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form'; 

const SalesCardLogic = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [expanded, setExpanded] = useState(false);
  const [account_id, setAccountId] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]); // Koszyk
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
  const sampleCartData = [
    {
      id: "1",
      name: "Product 1",
      category: "Category 1",
      description: "Description of Product 1",
      price: 29.99,
      quantity: 2
    },
    {
      id: "2",
      name: "Product 2",
      category: "Category 2",
      description: "Description of Product 2",
      price: 39.99,
      quantity: 1
    }
  ];  

  useEffect(() => {
    const idUser = localStorage.getItem('idUser');
    if (idUser) {
      setAccountId(idUser);
    }    
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const sendCartDataToBackend = (cart:any) => {
      // await axiosInstance.post('/cart', cart, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      console.log(JSON.stringify(cart));
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
      sendCartDataToBackend(cart);
      

      notify(response.data);
      console.log(JSON.stringify(orderData));

      // Czyszczenie koszyka i formularza po złożeniu zamówienia
      setCart([]);
      reset();
    } catch (error) {
      console.error('Request failed:', error);
      notify("Nie udało się przekazać danych");
    }
  };

  const addToCart = (product:any) => {
    setCart([...cart, product]); // Dodanie produktu do koszyka
  };

  const handleChange = (field:any, value:any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  useEffect(() => {
    sampleCartData.forEach(product => {
      addToCart(product);
    });
  }, []);
  
  return {
    handleExpandClick,
    handleSubmit,
    addToCart,
    handleChange,
    formData,
    cart,
    expanded,
    onSubmit,
    register,
    formState: { errors } 
  };
};

export default SalesCardLogic;
