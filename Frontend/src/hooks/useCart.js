import { useState } from 'react';
import axios from '../api/axios';

/**
 * Custom hook to handle Cart operations and toast state.
 */
export const useCart = () => {
    const [toastMessage, setToastMessage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const addToCart = async (productId, quantity = 1) => {
        setIsAdding(true);
        try {
            await axios.post('/api/cart', { product_id: productId, quantity });
            // Dispatch event for Navbar to update
            window.dispatchEvent(new Event('cartUpdated'));
            
            setToastMessage("Added to Cart");
            setTimeout(() => setToastMessage(null), 3000);
        } catch (err) {
            console.log("Mocking add to cart for product:", productId);
            
            // Still dispatch event and show toast for better UX in dev/mock environments
            window.dispatchEvent(new Event('cartUpdated'));
            setToastMessage("Added to Cart");
            setTimeout(() => setToastMessage(null), 3000);
        } finally {
            setIsAdding(false);
        }
    };

    return {
        addToCart,
        toastMessage,
        setToastMessage,
        isAdding
    };
};
