import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { getCartState } from '../utils/cart-utils/getCartState';

export const CartContext = React.createContext();

export const CartProvider = ({ children, initialState }) => {
  const [cartState, setCartState] = useState(initialState || getCartState());
  return (
    <CartContext.Provider value={{ cartState, setCartState }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.string,
};
