import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import useSnackbarManager from "../../notification/useSnackbarManager";

const registerLogic = () => {
    const { snackbar, showSnackbar, handleClose } = useSnackbarManager();
    const REACT_APP_SITE_KEY: string = process.env
      .NEXT_PUBLIC_REACT_APP_SITE_KEY as string;
    const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [isHuman, setIsHuman] = useState(false);
    const captchaRef = useRef<ReCAPTCHA | null>(null);
    const router = useRouter();
  

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
      });

      const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

      const onCaptchaChange = async (token: string | null) => {
        if (token) {
          try {
            const responseCaptcha = await axios.post(`${BACKEND}/cap`, { token });
            if (responseCaptcha.data === "Human 👨 👩") {
              setCaptchaValue(token);
              setIsHuman(true);
            } else {
              setIsHuman(false);
            }
          } catch (error: any) {
            showSnackbar(error.response.data, "error");
          }
        }
      };

      const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${BACKEND}/register`, userData);
          if (response.status === 200) {
            console.log("Rejestracja udana:", response.data);
            setTimeout(() => router.push("/click-link"), 1000);
          }
        } catch (error: any) {
          showSnackbar(error.response.data, "error");
        }
      };

  return {
    isHuman,
    captchaRef,
    captchaValue,
    snackbar,
    handleClose,
    REACT_APP_SITE_KEY,
    userData,
    handleChange,
    onCaptchaChange,
    handleSubmit,
  };
};

export default registerLogic;
