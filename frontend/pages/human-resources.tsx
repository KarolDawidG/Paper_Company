import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedView";
import { Box, Typography } from "@mui/material";
import WarningPage from "@/app/components/pagesComponent/dashboard/WarningPage";
import AuthorizedViewHR from "@/app/components/pagesComponent/hr/AuthorizedViewHR";

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
        <WarningPage />
        <UnauthorizedViewSecurity children={'hr'}/>
      </Box>
    )
  }
  
  return (
    <AuthorizedViewHR />
  );
};

export default HumanResources;
