import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';

export const CardThird = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 999 }}>
      <CardHeader title="Fakturowanie"/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Tworzenie faktur
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sagittis justo at metus tristique, id tincidunt dui cursus. Nullam eu justo nec augue semper rhoncus. Nunc venenatis massa nec felis lacinia, vel cursus purus finibus.
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris feugiat risus sit amet orci cursus, in sodales arcu pharetra. Sed euismod justo ut sapien tincidunt, ut hendrerit sem suscipit.
            Curabitur efficitur velit eu metus consectetur, vel tincidunt lectus bibendum. Integer id ex et odio fermentum varius. In hac habitasse platea dictumst. Quisque nec turpis vel lectus lacinia venenatis.
            Vivamus fermentum, felis eu aliquet ultrices, justo mauris lacinia nisl, eu suscipit lectus nunc id enim. Sed interdum, nisl vel rhoncus vulputate, ex mi tristique ligula, nec bibendum velit orci in elit.
            Fusce eu bibendum sapien, vitae scelerisque orci. Sed tristique urna vel risus eleifend, vel hendrerit libero luctus. Maecenas bibendum, risus at euismod feugiat, justo mi volutpat felis, ac cursus nulla nisl id purus.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}