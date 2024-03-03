import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Drawer, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { FaShoppingCart, FaWarehouse, FaRegMoneyBillAlt, FaUserTie, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { FiCompass, FiMenu } from 'react-icons/fi';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import useTranslation from '../useTranslation';

export const Sidebars = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const currentLocale = localStorage.getItem('locale') || 'en';
    const t = useTranslation(currentLocale);

    const isActive = (path: any) => router.pathname === path;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    if (!t.side_bar) {
        return <div>Loading translations...</div>;
      }

    const menuItems = [
        { name: `${t.side_bar.dashboard}`, path: '/dashboard', icon: <FiCompass />, color: 'blue' },
        { name: `${t.side_bar.sales_and_orders}`, path: '/sales-and-orders', icon: <FaShoppingCart />, color: 'green' },
        { name: `${t.side_bar.warehouse}`, path: '/warehouse', icon: <FaWarehouse />, color: 'orange' },
        { name: `${t.side_bar.accounting}`, path: '/accounting', icon: <FaRegMoneyBillAlt />, color: 'red' },
        { name: `${t.side_bar.h_r}`, path: '/human-resources', icon: <FaUserTie />, color: 'purple' },
        { name: `${t.side_bar.data_analysis}`, path: '/data-analysis', icon: <FaChartLine />, color: 'pink' },
        { name: `${t.side_bar.security}`, path: '/security', icon: <FaShieldAlt />, color: 'gray' },
    ];

    const drawerWidth = isLargeScreen ? 280 : 240;

    const drawerContent = (
        <List>
            <Box textAlign="center" my={2}>
                <Image src={logo} alt="Logo Paper Company" width={150} height={150} />
            </Box>
            {menuItems.map((item, index) => (
                <ListItemButton
                    key={index}
                    sx={{
                        bgcolor: isActive(item.path) ? item.color : "inherit",
                        '&:hover': {
                            bgcolor: item.color,
                            color: 'white',
                            '.MuiListItemIcon-root': {
                                color: 'white',
                            },
                        },
                        color: isActive(item.path) ? 'white' : 'inherit',
                        '.MuiListItemIcon-root': {
                            color: isActive(item.path) ? 'white' : 'inherit',
                        },
                        textDecoration: 'none',
                    }}
                    onClick={() => {
                        router.push(item.path);
                        if (mobileOpen) setMobileOpen(false);
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        {React.cloneElement(item.icon, {
                            size: isActive(item.path) ? 26 : 18,
                        })}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItemButton>
            ))}
        </List>
    );

    return (
        <Box display="flex">
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            >
                <FiMenu />
            </IconButton>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, 
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawerContent}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: { md: `${drawerWidth}px` } }}>
                {children}
            </Box>
        </Box>
    );
};
