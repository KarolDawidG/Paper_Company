import React from "react";
import useTranslation from "../../language/useTranslation";
import LinearProgress from "@mui/material/LinearProgress";

const AuthorizedViewSecurity = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  if (!t.security) {
    return <LinearProgress />
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        <p>This view is only for admin</p>
        {t.security.title}
      </h1>
    </div>
  );
};

export default AuthorizedViewSecurity;
