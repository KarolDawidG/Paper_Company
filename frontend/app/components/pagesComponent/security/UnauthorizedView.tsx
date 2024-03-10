import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import axiosInstance from "@/app/api/axiosInstance";
import {UserCard} from "./Card";

const UnauthorizedViewSecurity = ({children}:any) => {
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const role = children;
      try {
        const response = await axiosInstance.get(`/users/${role}`);
        setUserData(response.data.usersList);
      } catch (error) {
        console.error("Nie udało się pobrać danych użytkownika.", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box>
      <Grid container spacing={2} alignItems="stretch">
        {userData && userData.map((user:any) => (
          <Grid key={user.id} xs={12} sm={6} md={4}>
            <UserCard username={user.username} email={user.email} img_url={user.img_url}/>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default UnauthorizedViewSecurity;
