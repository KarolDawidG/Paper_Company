import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedView";
import { Box, Typography } from "@mui/material";

const HumanResources = () => {
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

  if (userRole !== "hr") {

    return (
      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Nie masz uprawnien do dostepu do tego komponentu!
        </Typography>
        <Typography>
          Ponizej znajduje sie lista pracownikow, z ktorymi mozesz sie skontaktowac w danej sprawie!
        </Typography>
        <UnauthorizedViewSecurity children={'hr'}/>
      </Box>
    )
  }
  
  return (
    <Box>
      <Typography>Strona w budowie</Typography>
    </Box>
  );
};

export default HumanResources;
