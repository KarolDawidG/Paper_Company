import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedView";
import { Box, Typography } from "@mui/material";

const Warehouse = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data: any = localStorage.getItem("role");
      if (data !== userRole) {
        setUserRole(data);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }, []);

  if (!userRole) return <LinearProgress />;

  if (userRole !== "warehouse") {

    return (
      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Nie masz uprawnien do dostepu do tego komponentu!
        </Typography>
        <Typography>
          Ponizej znajduje sie lista pracownikow, z ktorymi mozesz sie skontaktowac w danej sprawie!
        </Typography>
        <UnauthorizedViewSecurity children={'warehouse'}/>
      </Box>
    )
  }
  
  return (
    <Box>
      <Typography>Strona w budowie</Typography>
    </Box>
  );
};

export default Warehouse;
