import React, { createContext, useContext, useState } from 'react';
import axiosInstance from "@/app/api/axiosInstance";
import {notify} from "@/app/components/notification/Notify";
import useTranslation from '@/app/components/language/useTranslation';
import useTranslationStatus from '@/app/components/language/useTranslationStatus';

interface Product {
    id: string;
    clickCount: number;
  }

interface CartContextType {
    cartItems: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (index: number) => void;
    increaseClickCount: (index: number) => void;
    decreaseClickCount: (index: number) => void;
    buyProducts: () => Promise<void>;
  }

const CartContext = createContext<CartContextType | undefined>(undefined);
  
export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Product[]>([]);
    const [clickCount, setClickCount] = useState(0);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
      
    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    const isTranslationLoaded = useTranslationStatus(currentLocale);

    const addToCart = (product: Product) => {
        setClickCount(prevCount => prevCount + 1);
        setCart([...cart, product]);

        const existingProducts: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingProductIndex = existingProducts.findIndex(item => item.id === product.id);
        if (existingProductIndex !== -1) {
            existingProducts[existingProductIndex].clickCount += 1;
        } else {
            existingProducts.push({ ...product, clickCount: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(existingProducts));
        setCartItems(existingProducts);
    };

    const removeFromCart = (index:number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const increaseClickCount = (index:number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].clickCount += 1;
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const decreaseClickCount = (index:number) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].clickCount > 0) {
            updatedCartItems[index].clickCount -= 1;
        }
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
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
            localStorage.removeItem('order_id')
            setCartItems([]);

            if (isTranslationLoaded) {
                notify(`${t.notification.products_sent}`);
              }
            
            return;
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseClickCount, decreaseClickCount, buyProducts }}>
            {children}
        </CartContext.Provider>
    );
};
