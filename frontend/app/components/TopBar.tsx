import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/navigation'; 

const TopBar = () => {
    const router = useRouter();

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="mode">
                    D
                </IconButton>

                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Paper Company
                </Typography>

                <IconButton color="inherit" aria-label="info">
                    <InfoIcon />
                </IconButton>

                <IconButton color="inherit" aria-label="logout">
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;