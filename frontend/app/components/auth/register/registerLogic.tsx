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

  // 27.5.3: Czyścimy stan captcha po wygaśnięciu lub błędzie, żeby przycisk rejestracji nie został aktywny pozornie.
  const resetCaptchaState = () => {
    setCaptchaValue(null);
    setIsHuman(false);
  };

  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      resetCaptchaState();
      return;
    }

    try {
      const responseCaptcha = await axios.post(`${BACKEND}/cap`, { token });
      if (responseCaptcha.data === "Human 👨 👩") {
        setCaptchaValue(token);
        setIsHuman(true);
        return;
      }

      resetCaptchaState();
    } catch (error: any) {
      resetCaptchaState();
      showSnackbar(error.response?.data || "Captcha verification failed.", "error");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 27.5.4: Blokujemy rejestrację bez poprawnie zweryfikowanej captcha także na poziomie submitu.
    if (!isHuman || !captchaValue) {
      showSnackbar("Potwierdź reCAPTCHA przed rejestracją.", "error");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND}/register`, userData);
      if (response.status === 200) {
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
    resetCaptchaState,
    onCaptchaChange,
    handleSubmit,
  };
};

export default registerLogic;
