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
import axiosInstance from "@/app/api/axiosInstance";

const TopBar = ({ toggleTheme, mode, setLocale }: any) => {
  const router = useRouter();
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  const [currentLocale, setCurrentLocale] = useState("en");
  const [urlImg, setUrlImg] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const storedLocale = localStorage.getItem("idUser");
        const res = await axiosInstance.get(`${BACKEND}/url/${storedLocale}`);
        const responseData = res.data.img_url;
        setUrlImg(responseData);
      } catch (error) {
        console.error("Błąd:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("locale") || "en";
  }, []);

  const handleChangeLanguage = (locale: string) => {
    setLocale(locale);
    setCurrentLocale(locale);
    localStorage.setItem("locale", locale);
  };

  //add endpont in backend side
  const handleLogOut = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("idUser");
      router.push("/");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar alt="User avatar" src={urlImg} />
        <Typography variant="h6" style={{ flexGrow: 1, marginLeft: "10px" }}>
          Paper Company
        </Typography>
        <Button
          color="inherit"
          onClick={() => handleChangeLanguage("pl")}
          style={{
            backgroundColor: currentLocale === "pl" ? "grey" : "transparent",
          }}
        >
          PL
        </Button>
        <Button
          color="inherit"
          onClick={() => handleChangeLanguage("en")}
          style={{
            backgroundColor: currentLocale === "en" ? "grey" : "transparent",
          }}
        >
          EN
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
