import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export const UserCard = ({email, username, img_url}:any) => {
  
  return (
    <Card sx={{ width: '90%', height: '90%', margin: '30px 4px 10px 20px'}}>
      <CardHeader
        avatar={<Avatar aria-label="recipe" src={img_url} />}
        title={username}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          E-mail: {email}
        </Typography>
      </CardContent>

    </Card>
  );
}