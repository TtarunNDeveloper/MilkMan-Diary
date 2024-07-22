export const AppReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_USER_DETAILS':
        return {
          ...state,
          user: action.payload,
        };
      case 'FETCH_USER_ADD_TO_CART':
        return {
          ...state,
          cart: action.payload,
        };
      default:
        return state;
    }
  };
  
