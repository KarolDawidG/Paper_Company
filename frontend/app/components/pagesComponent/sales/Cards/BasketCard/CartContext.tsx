import React, { createContext, useContext, useState } from 'react';
import axiosInstance from "@/app/api/axiosInstance";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [clickCount, setClickCount] = useState(0);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);


    const addToCart = (product) => {
        setClickCount(prevCount => prevCount + 1);
        setCart([...cart, product]);

        const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingProductIndex = existingProducts.findIndex(item => item.id === product.id);
        if (existingProductIndex !== -1) {
            existingProducts[existingProductIndex].clickCount += 1;
        } else {
            existingProducts.push({ ...product, clickCount: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(existingProducts));
        setCartItems(existingProducts);
    };

    const removeFromCart = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const increaseClickCount = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].clickCount += 1;
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const decreaseClickCount = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].clickCount > 0) {
            updatedCartItems[index].clickCount -= 1;
        }
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    const buyProducts = async () =>{
        const testId = '33e56799-8de0-490c-ad72-427571e6fb5d';

        const basketData = {
            ...cartItems,
            order_id: testId
        };

        try {
            const response = await axiosInstance.post('/basket', basketData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response.data);
            return response.data;
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
