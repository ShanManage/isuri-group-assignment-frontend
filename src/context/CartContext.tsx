import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import { CartContextType, CartState, CartAction, CartItem } from "../interface";
import { LOCAL_STORAGE_KEYS } from "../constant";

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCartState: CartState = { userCart: {} };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { userId, item } = action.payload;
      const existingItems = state.userCart[userId] || [];
      const existingItem = existingItems.find((cartItem) => cartItem.id === item.id);
      const updatedItems = existingItem
        ? existingItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        : [...existingItems, item];

      return {
        ...state,
        userCart: { ...state.userCart, [userId]: updatedItems },
      };
    }
    case "REMOVE_ITEM": {
      const { userId, id } = action.payload;
      const existingItems = state.userCart[userId] || [];
      const updatedItems = existingItems.filter((cartItem) => cartItem.id !== id);

      return {
        ...state,
        userCart: { ...state.userCart, [userId]: updatedItems },
      };
    }
    case "UPDATE_QUANTITY": {
      const { userId, id, quantity } = action.payload;
      const existingItems = state.userCart[userId] || [];
      const updatedItems = existingItems.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, quantity } : cartItem
      );

      return {
        ...state,
        userCart: { ...state.userCart, [userId]: updatedItems },
      };
    }
    case "LOAD_CART": {
      const newState: CartState = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const userId = currentUser?.id;

  useEffect(() => {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEYS.CART_DATA);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart) as CartState;
      dispatch({ type: "LOAD_CART", payload: parsedCart });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART_DATA, JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) => {
    if (!userId) {
      throw new Error("User must be logged in to add items to the cart.");
    }
    dispatch({ type: "ADD_ITEM", payload: { userId, item } });
  };

  const removeItem = (id: number) => {
    if (!userId) {
      throw new Error("User must be logged in to remove items from the cart.");
    }
    dispatch({ type: "REMOVE_ITEM", payload: { userId, id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (!userId) {
      throw new Error("User must be logged in to update cart item quantity.");
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { userId, id, quantity } });
  };

  const cartItems = userId ? state.userCart[userId] || [] : [];

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
