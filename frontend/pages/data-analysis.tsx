import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedView";
import { Box, Typography } from "@mui/material";
import WarningPage from "@/app/components/pagesComponent/dashboard/WarningPage";
import AuthorizedViewAnalizing from "@/app/components/pagesComponent/analizing/AuthorizedViewAnalizing";

const DataAnalysis = () => {
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

  // 777 superuser: Konto testowe ma dostęp do każdego modułu bez przełączania roli na froncie.
  if (userRole !== "analize" && userRole !== "superuser") {

    return (
      <Box>
        <WarningPage />
        <UnauthorizedViewSecurity children={'analize'}/>
      </Box>
    )
  }
  
  return (
    <Box>
      <AuthorizedViewAnalizing/>
    </Box>
  );
};

export default DataAnalysis;
