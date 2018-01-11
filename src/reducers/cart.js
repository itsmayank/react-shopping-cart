  export default function reducer(state = [], action) {

  switch (action.type) {
    case "ADD_TO_CART": {

      // This adds new item to the cart array, in this the State without mutating it.
      return [
        ...state, action.payload
      ]
      break;
    }
    case "UPDATE_CART": {

      // This finds the item that is already available in the cart array and updates 
      // the item's quantity without mutating directly the State

      return state.map((item, index) => {
          if(index !== action.index) {
              return item;
          }
          
          return [
              ...state,
              ...action.payload
          ]    
      });
    }
    case "REMOVE_ITEM": { 
      
      // Removes the item from cart array without directly mutating the state.
      // The Array.prototype.filter() method prevents us from mutating the array

      const itemIndex = state.findIndex(i => i.item === action.payload);
      return state.filter((item, index) => index != itemIndex);
    }
  }

  return state;
}