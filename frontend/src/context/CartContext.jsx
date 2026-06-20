import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    // Initialize state from localStorage if available, otherwise empty array
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Sync to localStorage whenever cartItems change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    // item expects: { id, name, price, image, size (optional) }
    const addToCart = (product, quantity, size = 'Regular') => {
        setCartItems(prevItems => {
            // Check if item with same ID and size already exists in cart
            const existingItemIndex = prevItems.findIndex(
                item => item.id === product.id && item.size === size
            );

            if (existingItemIndex >= 0) {
                // If it exists, just update the quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Otherwise, add new item
                return [...prevItems, { ...product, quantity, size }];
            }
        });
    };

    // Remove item from cart completely
    const removeFromCart = (itemId, size = 'Regular') => {
        setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.size === size)));
    };

    // Update quantity for a specific item
    const updateQuantity = (itemId, size, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId, size);
            return;
        }
        
        setCartItems(prevItems => 
            prevItems.map(item => 
                (item.id === itemId && item.size === size) 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );
    };

    // Clear the entire cart
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    // Calculate total price
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calculate total number of items
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
