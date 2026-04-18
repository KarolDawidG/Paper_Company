import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "@/app/api/axiosInstance";
import { useImage } from "../utils/context/ImageContext";

const TopBar = ({ toggleTheme, mode, setLocale }: any) => {
  const { imageUrl, setImageUrl }: string | any = useImage();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(localStorage.getItem("locale") || "en");
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  const [urlImg, setUrlImg] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const storedLocale = localStorage.getItem("idUser");

        const res = await axiosInstance.get(`${BACKEND}/url/${storedLocale}`);
        const responseData = res.data.img_url;
        setUrlImg(responseData);
        setImageUrl(responseData);
      } catch (error) {
        console.error("Błąd:", error);
      }
    })();
  }, [setImageUrl]);

  const handleChangeLanguage = (locale: string) => {
    setLocale(locale);
    setCurrentLocale(locale);
    localStorage.setItem("locale", locale);
  };

  //add endpont in backend side
  const handleLogOut = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const idUser = localStorage.getItem("idUser");

    try {
      // Informujemy backend o wylogowaniu, żeby unieważnić refresh token w bazie.
      if (token && refreshToken && idUser) {
        await axios.post(
          `${BACKEND}/logout`,
          { idUser, refreshToken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("idUser");
      localStorage.removeItem("order_id");
      sessionStorage.removeItem("clientId");
      sessionStorage.removeItem("addressId");
      router.push("/");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar alt="User avatar" src={imageUrl} />
        <Typography variant="h6" style={{ flexGrow: 1, marginLeft: "10px" }}>
          Paper Company
        </Typography>
        <Button
          color="inherit"
          onClick={() => handleChangeLanguage("pl")}
          style={{backgroundColor: currentLocale === "pl" ? "grey" : "transparent"}}
        >
          PL
        </Button>
        <Button
          color="inherit"
          onClick={() => handleChangeLanguage("en")}
          style={{backgroundColor: currentLocale === "en" ? "grey" : "transparent"}}
        >
          EN
        </Button>
        <Button
          color="inherit"
          onClick={() => handleChangeLanguage("fr")}
          style={{backgroundColor: currentLocale === "fr" ? "grey" : "transparent"}}
        >
          FR
        </Button>
        <IconButton
          edge="start"
          style={{ marginLeft: "10px" }}
          color="inherit"
          aria-label="mode"
          onClick={toggleTheme}
        >
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton
          color="inherit"
          style={{ marginLeft: "10px" }}
          aria-label="logout"
          onClick={handleLogOut}
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
