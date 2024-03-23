import * as React from 'react';
import { Collapse, Grid, CardActions, CardContent, CardHeader, Card, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../ExpandMore';
import { useEffect, useState } from "react";
import { useCart } from './CartContext';

export const CardThird = () => {
    const { cartItems, addToCart, removeFromCart, increaseClickCount, decreaseClickCount } = useCart();
    const [expanded, setExpanded] = React.useState(false);
    // const [cartItems, setCartItems] = useState([]);

    // useEffect(() => {
    //     const storedCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    //     setCartItems(storedCartItems);
    // }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDeleteItem = (index) => {
        removeFromCart(index);
        // const updatedCartItems = [...cartItems];
        // updatedCartItems.splice(index, 1);
        // setCartItems(updatedCartItems);
        // localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const handleIncreaseClickCount = (index) => {
        increaseClickCount(index);
        // const updatedCartItems = [...cartItems];
        // updatedCartItems[index].clickCount += 1;
        // setCartItems(updatedCartItems);
        // localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const handleDecreaseClickCount = (index) => {
        decreaseClickCount(index)
        // const updatedCartItems = [...cartItems];
        // if (updatedCartItems[index].clickCount > 0) {
        //     updatedCartItems[index].clickCount -= 1;
        // }
        // setCartItems(updatedCartItems);
        // localStorage.setItem('cart', JSON.stringify(updatedCartItems));
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
