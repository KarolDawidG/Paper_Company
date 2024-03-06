import React, { useState, useEffect } from "react";
import axiosInstance from "../app/api/axiosInstance";
import { formatDate } from "@/app/components/helpers/formDate";
import { UserData } from "@/app/components/interface/userDataInterface";
import { notify } from "@/app/components/notification/Notify";
import {
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
} from "@mui/material";
import ImpageUpload from "@/app/components/cloud/ImpageUpload";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [id, setUserId] = useState<string | null>();
  const [editedData, setEditedData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const idUser:string | null = localStorage.getItem("idUser");
    setUserId(idUser);

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${idUser}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Nie udało się pobrać danych użytkownika.", error);
        notify("Nie udało się pobrać danych użytkownika.");
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedData({
      username: userData?.username || "",
      email: userData?.email || "",
    });
  };

  const handleSaveClick = async () => {
    try {
      setUserData((prevUserData) => ({
        ...prevUserData!,
        username: editedData.username,
        email: editedData.email,
      }));
      const response = await axiosInstance.put(`/users/${id}`, editedData);
      setEditMode(false);
      notify(response.data);
    } catch (error) {
      console.error("Nie udało się zapisać zmian.", error);
      notify("Nie udało się zapisać zmian.");
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box p={4} maxWidth="md" mx="auto">
          <Divider />
          <Typography variant="h4" align="center" mb={1}>
            Dashboard
          </Typography>
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
                </form>
              ) : (
                <div>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={`Username: ${userData.username}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`E-mail: ${userData.email}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`User role: ${userData.role}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Account creation date: ${formatDate(userData.created_at)}`}
                      />
                    </ListItem>
                  </List>
                </div>
              )}

              <Box mt={1}>
                {editMode ? (
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleSaveClick}
                      sx={{ marginRight: 2 }}
                    >
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelClick}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="outlined" onClick={handleEditClick}>
                    Edit
                  </Button>
                )}
              </Box>
            </div>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box p={8} maxWidth="100%">
          <ImpageUpload />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
