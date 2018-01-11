import axios from "axios";

export function getData(payload) {
  return function(dispatch) {
    //axios.get("https://gist.githubusercontent.com/itsmayank/2e0272a1a985af0a7134d145a2dbc1d2/raw/bfd1e406e0b7e6668a247c11cb16d32acc330373/products.json");
    //Mayank Sharma: 01.10/2018
    //TODO: I am using free online sample Rest API here. I could also have configured mock-server to complish this but didnt get that much time, so using free online stuffs. This has predefined pagination so can't controll anything here.  
    axios.get("https://reqres.in/api/users?page="+payload)
    
      .then((response) => {
        dispatch({type: "FETCH_ITEMS_FULFILLED", payload: response.data})
        dispatch(updatePage());
        
      })
      .catch((err) => {
        dispatch({type: "FETCH_ITMS_REJECTED", payload: err})
      })
  }
}

export function syncQuantity(payload) {
  return {
    type: "SYNC_QUANTITY",
    payload: payload
  }
}

export function updatePage() {
  return {
    type: "UPDATE_PAGE",
  }
}
export function getPage() {
  return {
    type: "GET_PAGE",
  }
}

