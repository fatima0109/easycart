import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product === product._id);
      if (existing) {
        return prev.map(item =>
          item.product === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { product: product._id, name: product.name, price: product.price, quantity, image: product.imageURL }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};