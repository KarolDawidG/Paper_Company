import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { formatDate } from "../../helpers/formDate";

interface ListItemProps {
  userData: {
    username: string;
    email: string;
    role: string;
    created_at: string;
  };
}

const ListUserItem: React.FC<ListItemProps> = ({ userData }) => (
  <List>
    <ListItem>
      <ListItemText primary={`Username: ${userData.username}`} />
    </ListItem>

    <ListItem>
      <ListItemText primary={`E-mail: ${userData.email}`} />
    </ListItem>

    <ListItem>
      <ListItemText primary={`User role: ${userData.role}`} />
    </ListItem>

    <ListItem>
      <ListItemText
        primary={`Account creation date: ${formatDate(userData.created_at)}`}
      />
    </ListItem>
  </List>
);

export default ListUserItem;
