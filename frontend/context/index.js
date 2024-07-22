import React, { createContext, useReducer } from 'react';
import { AppReducer } from './AppReducer'; 

const initialState = {
  user: null,
  cart: [],
};

const Context = createContext(initialState);

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/user'); // Adjust the API endpoint
      const data = await response.json();
      dispatch({ type: 'FETCH_USER_DETAILS', payload: data });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch('/api/cart'); // Adjust the API endpoint
      const data = await response.json();
      dispatch({ type: 'FETCH_USER_ADD_TO_CART', payload: data });
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };

  return (
    <Context.Provider
      value={{
        user: state.user,
        cart: state.cart,
        fetchUserDetails,
        fetchUserAddToCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
