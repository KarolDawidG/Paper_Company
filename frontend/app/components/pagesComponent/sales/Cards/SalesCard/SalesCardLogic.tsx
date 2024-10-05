import { useState } from "react";
import { useForm } from 'react-hook-form'; 

const SalesCardLogic = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return {
    handleExpandClick,
    handleSubmit,
    expanded,
    register,
    formState: { errors } 
  };
};

export default SalesCardLogic;
