import React from "react";
import { LinearProgress, List, ListItem, ListItemText } from "@mui/material";
import { formatDate } from "../../helpers/formDate";
import useTranslation from "@/app/components/language/useTranslation";

interface ListItemProps {
  userData: {
    username: string;
    email: string;
    role: string;
    created_at: string;
  };
}

const ListUserItem: React.FC<ListItemProps> = ({ userData }) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

    if (!t.dashboard) {
      return <LinearProgress />;
    }

  return (
    
    <List>
      <ListItem>
        <ListItemText primary={`${t.dashboard.username}: ${userData.username}`} />
      </ListItem>

      <ListItem>
        <ListItemText primary={`${t.dashboard.email}: ${userData.email}`} />
      </ListItem>

      <ListItem>
        <ListItemText primary={`${t.dashboard.user_role}: ${userData.role}`} />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={`${t.dashboard.creation_date} ${formatDate(userData.created_at)}`}
        />
      </ListItem>
    </List>
  )
};

export default ListUserItem;
