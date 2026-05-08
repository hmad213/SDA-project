import { createContext, useState } from "react";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.product.id === product.id);

      if (exists) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  }

  function removeFromCart(product) {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.product.id === product.id);

      if (!exists) {
        return prevCart;
      }

      if (exists.quantity === 1) {
        return prevCart.filter((item) => item.product.id !== product.id);
      } else {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
    });
  }

  function removeAllFromCart(product) {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.product.id === product.id);

      if (!exists) {
        return prevCart;
      }

      return prevCart.filter((item) => item.product.id !== product.id);
    });
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeAllFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
