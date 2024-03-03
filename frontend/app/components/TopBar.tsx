import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/navigation'; 

const TopBar = ({toggleTheme, mode, setLocale}: any) => {
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = useState('en'); 

    useEffect(() => {
        const storedLocale = localStorage.getItem('locale') || 'en';
        setCurrentLocale(storedLocale);
    }, []);

    const handleChangeLanguage = (locale: string) => {
        setLocale(locale); 
        setCurrentLocale(locale);
        localStorage.setItem('locale', locale);
    }

    //add endpont in backend side
    const handleLogOut = async () =>{
        try{
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('idUser');
            router.push('/');
        } catch (error) {
            console.error("Error: ", error)
        }
    }
    return (
        <AppBar position="static">
            <Toolbar>

                <IconButton edge="start" color="inherit" aria-label="mode" onClick={toggleTheme}>
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Paper Company
                </Typography>

                <IconButton color="inherit" aria-label="info">
                    <InfoIcon />
                </IconButton>

                <IconButton color="inherit" aria-label="logout" onClick={handleLogOut}>
                    <ExitToAppIcon />
                </IconButton>

                <Button 
                  color="inherit" 
                  onClick={() => handleChangeLanguage('pl')}
                  style={{ backgroundColor: currentLocale === 'pl' ? 'grey' : 'transparent' }}
                >
                  PL
                </Button>

                <Button 
                  color="inherit" 
                  onClick={() => handleChangeLanguage('en')}
                  style={{ backgroundColor: currentLocale === 'en' ? 'grey' : 'transparent' }}
                >
                  EN
                </Button>

            </Toolbar>
        </AppBar>
    );
};

export default TopBar;