import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedViewSecurity";
import AuthorizedViewSecurity from "@/app/components/pagesComponent/security/AuthorizedViewSecurity";

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

  if (!userRole) {
    return <LinearProgress />;
  }

  if (userRole !== "admin") {
    return <UnauthorizedViewSecurity />;
  }

  return <AuthorizedViewSecurity />;
};

export default Security;
