import React from 'react';
import { useRouter } from 'next/router';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import { FaShoppingCart, FaWarehouse, FaRegMoneyBillAlt, FaUserTie, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { FiCompass } from 'react-icons/fi';

export const Sidebars = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const isActive = (path: any) => router.pathname === path;

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <FiCompass />, color: 'blue' },
        { name: 'Sales and Orders', path: '/sales-and-orders', icon: <FaShoppingCart />, color: 'green' },
        { name: 'Warehouse', path: '/warehouse', icon: <FaWarehouse />, color: 'orange' },
        { name: 'Accounting', path: '/accounting', icon: <FaRegMoneyBillAlt />, color: 'red' },
        { name: 'Human Resources', path: '/human-resources', icon: <FaUserTie />, color: 'purple' },
        { name: 'Data Analysis', path: '/data-analysis', icon: <FaChartLine />, color: 'pink' },
        { name: 'Security', path: '/security', icon: <FaShieldAlt />, color: 'gray' },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <Box display="flex">
            <Drawer
                variant="permanent"
                open
                sx={{
                    width: 240,
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
                }}
            >
                <List>
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
                                }
                            }}
                            onClick={() => handleNavigation(item.path)}
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
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};
