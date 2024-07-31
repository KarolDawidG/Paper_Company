import React from "react";
import { Typography, Divider, LinearProgress } from "@mui/material";
import useTranslation from "@/app/components/language/useTranslation";

const WarningPage = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.warning_page) {
    return <LinearProgress />;
  }

  return (
    <>
        <Typography variant="h6" color="error" gutterBottom>
          {t.warning_page.permissions}
        </Typography>
        <Typography>
          {t.warning_page.user_list}
        </Typography>
    </>
  );
};

export default WarningPage;
