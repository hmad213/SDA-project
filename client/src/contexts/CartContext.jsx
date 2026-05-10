import { createContext, useState } from "react";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prevCart) => {
      const exists = prevCart.find(
        (item) => item.product.product_id === product.product_id,
      );

      if (exists) {
        return prevCart.map((item) =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [
          ...prevCart,
          {
            product: { ...product, price: Number(product.price) },
            quantity: 1,
          },
        ];
      }
    });
  }

  function removeFromCart(product) {
    setCart((prevCart) => {
      const exists = prevCart.find(
        (item) => item.product.product_id === product.product_id,
      );

      if (!exists) return prevCart;

      if (exists.quantity === 1) {
        return prevCart.filter(
          (item) => item.product.product_id !== product.product_id,
        );
      } else {
        return prevCart.map((item) =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
    });
  }

  function removeAllFromCart(item) {
    setCart((prevCart) =>
      prevCart.filter((c) => c.product.product_id !== item.product.product_id),
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeAllFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
