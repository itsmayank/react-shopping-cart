import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from './Button';
import QuantityBar from './QuantityBar';

import { addToCart } from './../actions/cartActions';
import { syncQuantity } from './../actions/catalogActions';


import sampleImage from './../product-images/1151135132250.jpg'


@connect((store) => {  
  return {
    cataLog: store.catalog
  }
})

export default class Item extends Component {

  constructor(props) {
    super(props);
  }
  
  _addToCart = (price, brandName, productName, quantity) => {
    const itemDetails = {
      item: productName,
      quantity: quantity,
      price: price,
      brand: brandName
    }

    this.setState({
      quantity: 1
    })

    const syncCatalog = {
      item: productName,
      quantity: quantity
    }

    this.props.dispatch(addToCart(itemDetails));
    this.props.dispatch(syncQuantity(syncCatalog));
  };

  render() {
    const { avatar, first_name, last_name,brandName, packageDetail, id, quantity } = this.props;
    
    return (
      <div className="item-wrapper">
        <div className="item-container">
          <div className="product-img">
            <img src={avatar} /> 
          </div>
          <div className="product-details">
            <div className="brand-name">
              {first_name}
            </div>
            <div className="product-name">
              {last_name}
            </div>
            <div className="package-detail">
                {last_name}
            </div>
            <div className="product-price">
              Rs {id*10}
            </div>
            {(quantity === 0 || quantity === undefined) ? <Button onClick={() => { this._addToCart(id*10, brandName, first_name, 1) }} /> : <QuantityBar item={first_name} />}
          </div>
        </div>
      </div>
    )
  }
}