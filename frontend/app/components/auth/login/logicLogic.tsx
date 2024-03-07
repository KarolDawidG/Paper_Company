import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { decodeJwt } from "jose";
import useSnackbarManager from "../../notification/useSnackbarManager";

const logicLogic = () => {
  const { snackbar, showSnackbar, handleClose } = useSnackbarManager();
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  useEffect (()=>{
    if (localStorage.getItem("token")){
      router.push('/dashboard');
    }
  }, []);

  const handleResetPasswordDialogClose = ({ success, message }: any) => {
    setResetPasswordDialogOpen(false);
    showSnackbar(message, success ? "info" : "error");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BACKEND}/auth`, {
        username,
        password,
      });

      if (response && response.status === 200) {
        const token = response.data.token;
        const idUser = response.data.idUser;

        localStorage.setItem("token", token);
        localStorage.setItem("idUser", idUser);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decodedToken: any = decodeJwt(token);
        const userRole = decodedToken.role;
        localStorage.setItem("role", userRole);

        router.push("/dashboard");
      }
    } catch (error: any) {
      showSnackbar(error.response.data, "error");
    }
  };


  return {
    snackbar, 
    showSnackbar, 
    handleClose,
    username,
    password,
    resetPasswordDialogOpen,
    useEffect,
    handleResetPasswordDialogClose,
    handleSubmit,
    setUsername,
    setPassword,
    setResetPasswordDialogOpen,
  };
};

export default logicLogic;
