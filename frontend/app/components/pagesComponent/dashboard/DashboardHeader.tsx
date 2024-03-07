import React from "react";
import { Typography, Divider } from "@mui/material";
import useTranslation from "../../language/useTranslation";

const DashboardHeader = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

return (
    <>
      <Divider />
        {t.side_bar && (
          <Typography variant="h4" align="center" mb={1}>
            {`${t.side_bar.dashboard}`}
          </Typography>
        )}
      <Divider />
    </>
  )};

export default DashboardHeader;
