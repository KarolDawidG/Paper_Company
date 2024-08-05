import * as React from 'react';
import { Collapse, Grid, CardActions, CardContent, CardHeader, Card, Button, LinearProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '../../utils/ExpandUtils/ExpandMore';
import { useCart } from './CartContext';
import useTranslation from "@/app/components/language/useTranslation";

export const BasketCard = () => {
    const { cartItems, buyProducts, translateCartObject, removeFromCart, increaseClickCount, decreaseClickCount }: any = useCart();
    const [expanded, setExpanded] = React.useState(false);
    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDeleteItem = (index: any) => {
        removeFromCart(index);
    };

    const handleIncreaseClickCount = (index: any) => {
        increaseClickCount(index);
    };

    const handleDecreaseClickCount = (index: any) => {
        decreaseClickCount(index);
    };

    const handleBuyProducts = () => {
        buyProducts()
    };

    const cartDetails = translateCartObject.map((product: any) => {
        const cartItem = cartItems.find((ci: any) => ci.id === product.product_id);
        return {
            ...product,
            price: cartItem ? cartItem.price : 1,
            clickCount: cartItem ? cartItem.clickCount : 0
        };
    });

    if (!t.basket_card) {
        return <LinearProgress />;
    }

    return (
        <Card sx={{ maxWidth: '100%' }}>
            <CardHeader title={`${t.basket_card.title}`} />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {t.basket_card.cart_contents}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Grid container justifyContent="flex-end">
                    <Typography variant="h6" color="text.secondary">{t.basket_card.submit}</Typography>
                    <Button onClick={() => handleBuyProducts()}>{t.basket_card.buy}</Button>
                </Grid>

                <CardContent>
                    <Grid container spacing={2}>
                        {cartDetails.map((item: any, index: any) => (
                            <Grid item xs={12} key={index}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">{item.name}</Typography>
                                        <Grid container justifyContent="flex-start">
                                            <Typography variant="h6" color="text.secondary">{t.basket_card.change_quantity}: </Typography>
                                            <Button onClick={() => handleDecreaseClickCount(index)}>-</Button>
                                            <Button onClick={() => handleIncreaseClickCount(index)}>+</Button>
                                        </Grid>
                                        <Typography variant="body2" color="text.secondary">{t.basket_card.quantity}: {item.clickCount}</Typography>
                                        <Typography variant="body2" color="text.secondary">{t.basket_card.price}: {(item.price * item.clickCount).toFixed(2)}</Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Grid container justifyContent="flex-end">
                                            <Button onClick={() => handleDeleteItem(index)}>{t.basket_card.delete}</Button>
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
};