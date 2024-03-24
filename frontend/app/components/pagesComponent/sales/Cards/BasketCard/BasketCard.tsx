import * as React from 'react';
import { Collapse, Grid, CardActions, CardContent, CardHeader, Card, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import { useCart } from './CartContext';

export const CardThird = () => {
    const { cartItems, removeFromCart, increaseClickCount, decreaseClickCount, buyProducts } = useCart();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDeleteItem = (index) => {
        removeFromCart(index);
    };

    const handleIncreaseClickCount = (index) => {
        increaseClickCount(index);
    };

    const handleDecreaseClickCount = (index) => {
        decreaseClickCount(index)
    };

    const handleBuyProducts = () => {
        buyProducts()
    };

    return (
        <Card sx={{ maxWidth: '100%' }}>
            <CardHeader title="Koszyk" />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Zawartosc koszyka
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>

                <Grid container justifyContent="flex-end">
                    <Typography variant="h6" color="text.secondary">Zloz zamowienie  </Typography>
                    <Button onClick={() => handleBuyProducts()}>Buy</Button>
                </Grid>

                <CardContent>
                    <Grid container spacing={2}>
                        {cartItems.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">{item.name}</Typography>
                                        <Grid container justifyContent="flex-start">
                                            <Typography variant="h6" color="text.secondary">Zmien ilosc:  </Typography>
                                            <Button onClick={() => handleDecreaseClickCount(index)}>-</Button>
                                            <Button onClick={() => handleIncreaseClickCount(index)}>+</Button>
                                        </Grid>
                                        <Typography variant="body2" color="text.secondary">Ilosc: {item.clickCount}</Typography>
                                        <Typography variant="body2" color="text.secondary">Cena: {(item.price * item.clickCount).toFixed(2)}</Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Grid container justifyContent="flex-end">
                                            <Button onClick={() => handleDeleteItem(index)}>Delete</Button>
                                        </Grid>
                                    </CardContent>

                                </Card>

                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    );
}
