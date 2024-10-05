import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from "@/app/api/axiosInstance";
import useTranslation from '@/app/components/language/useTranslation';
import useTranslationStatus from '@/app/components/language/useTranslationStatus';
import { notify } from '@/app/components/notification/Notify';

interface Product {
    id: string;
    price: number;
    clickCount: number;
}

interface ProductDetail {
    product_id: string;
    language_id: string;
    name: string;
    description: string;
    price: number;
}

const CartContext = createContext<any | undefined>(undefined);

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
    const [translateCartObject, setTranslateCartObject] = useState<ProductDetail[]>([]);

    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    const isTranslationLoaded = useTranslationStatus(currentLocale);

    const fetchProductDetails = async () => {
        try {
            const productDetails = await Promise.all(cartItems.map(async (item: Product) => {
                const response = await axiosInstance.get(`/products/cart/${item.id}?locale=${currentLocale}`);
                return response.data;
            }));

            setTranslateCartObject(productDetails.flat());
    
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        }
    };

    const addToCart = (product: Product) => {
        const existingProducts: Product[] = [...cartItems];
        const existingProductIndex = existingProducts.findIndex(item => item.id === product.id);

        if (existingProductIndex !== -1) {
            existingProducts[existingProductIndex].clickCount += 1;
        } else {
            existingProducts.push({ ...product, clickCount: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(existingProducts));
        setCartItems(existingProducts);
    };

    const removeFromCart = (index: number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };

    const increaseClickCount = (index: number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].clickCount += 1;
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };

    const decreaseClickCount = (index: number) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].clickCount > 0) {
            updatedCartItems[index].clickCount -= 1;
        }
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };

    const buyProducts = async () =>{
        const order_id = localStorage.getItem('order_id');
        const cart = localStorage.getItem('cart');

        if (isTranslationLoaded && !order_id) {
            notify(`${t.notification.number_missing}`);
            return;
        }

        if (isTranslationLoaded && !cart) {
            notify(`${t.notification.cart_missing}`);
            return;
        }

        const basketData = {
            ...cartItems,
            order_id: order_id
        };

        try {
            const response = await axiosInstance.post('/basket', basketData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.removeItem('cart');
            localStorage.removeItem('order_id');
            sessionStorage.removeItem('clientId');
            sessionStorage.removeItem('addressId');
            setCartItems([]);

            if (isTranslationLoaded) {
                notify(`${t.notification.products_sent}`);
              }
            
            return;
        } catch (error) {
            console.error('Request failed:', error);
        }
    };
    
    useEffect(() => {
        fetchProductDetails();
    }, [currentLocale, cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, buyProducts, addToCart, removeFromCart, increaseClickCount, decreaseClickCount, fetchProductDetails, translateCartObject }}>
            {children}
        </CartContext.Provider>
    );
};