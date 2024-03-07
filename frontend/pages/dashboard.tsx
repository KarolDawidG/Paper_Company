import React from "react";
import { Button, Box, Grid } from "@mui/material";
import ImpageUpload from "@/app/components/cloud/ImpageUpload";
import DashboardHeader from "@/app/components/pagesComponent/dashboard/DashboardHeader";
import FormFields from "@/app/components/pagesComponent/dashboard/FormFields";
import ListUserItem from "@/app/components/pagesComponent/dashboard/ListUserItem";
import useUserData from "@/app/components/pagesComponent/dashboard/useUserData";

const Dashboard = () => {
  const {
    userData,
    editMode,
    editedData,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange,
  } = useUserData();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box p={4} maxWidth="md" mx="auto">
          <DashboardHeader/>
          {userData && (
            <div>
              {editMode ? (
                <FormFields editedData={editedData} handleInputChange={handleInputChange}/>
              ) : (
                  <ListUserItem userData={userData}/>
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
          <ImpageUpload />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
