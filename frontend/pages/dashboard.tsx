import React, { useState, useEffect } from "react";
import axiosInstance from '../app/api/axiosInstance'; 
import { formatDate } from "@/app/components/helpers/formDate";
import { UserData } from "@/app/components/interface/userDataInterface";
import { notify } from "@/app/components/notification/Notify";
import { Typography, Button, Avatar, TextField, Box, List, ListItem, ListItemText, Grid, Divider } from "@mui/material";

const Dashboard = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({
        username: '',
        email: '',
        profilePicture: null,
    });

    useEffect(() => {
        const idUser = localStorage.getItem('idUser');

        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${idUser}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Nie udało się pobrać danych użytkownika.', error);
                notify('Nie udało się pobrać danych użytkownika.')
            }
        };

        fetchUserData();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
        setEditedData({
            username: userData?.username || '',
            email: userData?.email || '',
            profilePicture: null,
        });
    };

    const handleSaveClick = async () => {
        try {
            // TODO
            // Wysyłanie danych do serwera w celu zapisania zmian
            //await axiosInstance.put(`/users/${userData?.id}`, editedData);
            
            // Aktualizacja danych użytkownika po edycji
            setUserData(prevUserData => ({
                ...prevUserData!,
                username: editedData.username,
                email: editedData.email,
                
            }));
    
            setEditMode(false);
            notify('Zmiany zostały zapisane.');
        } catch (error) {
            console.error('Nie udało się zapisać zmian.', error);
            notify('Nie udało się zapisać zmian.')
        }
    };
    
    const handleCancelClick = () => {
        setEditMode(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

return (
<Grid container spacing={4}>
    <Grid item xs={12} md={6}>
    <Box p={4} maxWidth="md" mx="auto">
    <Divider />
        <Typography variant="h4" align="center" mb={1}>Dashboard</Typography>
    <Divider />
      {userData && (
        <div>
          {editMode ? (
           <form>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                id="username"
                name="username"
                value={editedData.username}
                onChange={handleInputChange}
                />
                <TextField
                    label="E-mail"
                    variant="outlined"
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                                
                />
            </form> ) : (
              <div>
                <Box display="flex" marginTop={1} alignItems="center" mb={2}>
                    <Avatar alt="User avatar" src={'https://thispersondoesnotexist.com/'} />
                    <Typography variant="h6" ml={2}>Zmien zdjecie</Typography>
                </Box>
                 <List>
                     <ListItem>
                         <ListItemText primary={`Username: ${userData.username}`} />
                     </ListItem>
                     <ListItem>
                         <ListItemText primary={`E-mail: ${userData.email}`} />
                     </ListItem>
                     <ListItem>
                         <ListItemText primary={`User role: ${userData.role}`} />
                     </ListItem>
                     <ListItem>
                         <ListItemText primary={`Account creation date: ${formatDate(userData.created_at)}`} />
                     </ListItem>
                 </List>
             </div>
            )}

            <Box mt={1}>
              {editMode ? (
                <div>
                    <Button variant="contained" onClick={handleSaveClick} sx={{ marginRight: 2 }}>Save</Button>
                    <Button variant="outlined" onClick={handleCancelClick}>Cancel</Button>
                </div>
                ) : (
                    <Button variant="outlined" onClick={handleEditClick}>Edit</Button>
                )}
            </Box>
        </div>
    )}
    </Box>
    </Grid>
    <Grid item xs={12} md={6}>
        <Box p={8} maxWidth="100%">
            <Typography variant="h6" mb={1}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
        </Box>
    </Grid>
</Grid>
);
}

export default Dashboard;