import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedView";
import AuthorizedViewSecurity from "@/app/components/pagesComponent/security/AuthorizedViewSecurity";
import { Box, Typography } from "@mui/material";
import WarningPage from "@/app/components/pagesComponent/dashboard/WarningPage";

const Security = () => {
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
  if (userRole !== "admin" && userRole !== "superuser") {

    return (
      <Box>
        <WarningPage />
        <UnauthorizedViewSecurity children={'admin'}/>
      </Box>
    )
  }
  
  return <AuthorizedViewSecurity />;
};

export default Security;
