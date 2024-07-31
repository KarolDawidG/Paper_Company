import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import AuthorizedViewSales from "@/app/components/pagesComponent/sales/AuthorizedViewSales";
import UnauthorizedViewSecurity from "@/app/components/pagesComponent/security/UnauthorizedView";
import { Box, Typography } from "@mui/material";
import useTranslation from "@/app/components/language/useTranslation";
import WarningPage from "@/app/components/pagesComponent/dashboard/WarningPage";

const SalesAndOrders = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

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

  if (!t.security) {
    return <LinearProgress />;
  }

  if (!userRole) return <LinearProgress />;

  if (userRole !== "sales"){

    return (
      <Box sx={{ margin: "0 0 20px 0" }}>
        <Typography variant="h1" gutterBottom>
          {t.sales_and_orders.title}
        </Typography>
        <WarningPage />
        <UnauthorizedViewSecurity children={'sales'}/>
      </Box>
    )
  }

  return <AuthorizedViewSales />;
};

export default SalesAndOrders;
