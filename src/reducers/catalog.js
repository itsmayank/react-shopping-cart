export default function reducer(state = {
  items: []
}, action) {
  switch (action.type) {
    case "FETCH_ITEMS": {
      return {
        ...state
      }
    }
    case "FETCH_ITEMS_FULFILLED": {
      var prevItems = state.items;
      if(typeof(state.items.data) !== "undefined")
      {
        prevItems.data.push.apply(prevItems.data,action.payload.data) // this is not mutabling, need work here.  
        //const newState = Object.assign({}, state.items.data , action.payload.data)
       
        return {
          ...state,
          items:  prevItems
        }
      } 
      else
      {
        return {
            ...state,
            items:  Object.assign({}, state.items, action.payload)
        }
      }
      break;
    }
    case "SYNC_QUANTITY": {
      const { quantity, item } = action.payload;
      //state.items.map((thisItem) => thisItem.productName == item ? thisItem.quantity = quantity : null)

      return {
        ...state
      }
    }    
    case "UPDATE_PAGE": {
      if(typeof(state.pageNumber) !== "undefined")
        state.pageNumber = state.pageNumber+1;
      else
        state.pageNumber = 1;

      return {
        ...state
      }
    }    
    case "GET_PAGE": {
      return {
        ...state
      }
    }
  }

  return state;
}