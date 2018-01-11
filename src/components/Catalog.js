import React, { Component } from 'react';
import Item from './Item';
import { getData, updatePage, getPage} from './../actions/catalogActions';

import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

const mapDispatchToProps = () => {
  return {
    updatePage: updatePage,
    getPage: getPage
  };
};

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  
/*   componentWillReceiveProps() {
    this.state = {
      items : this.props.items
    }

  } */
  fetchData(){
    this.props.dispatch({type: "GET_PAGE"});
    let some = this.props.dispatch(getData(this.props.items.pageNumber));
  }
  refresh(){}
  render() {
    const { items } = this.props;

    let catalogItems = items.items ? items.items : items; 
    //const catalogItems = this.state.items; 
    //console.log("catelogItems="+JSON.stringify(catalogItems));
    //console.log("typeofcatelogItems="+(catalogItems).length);
    return (
      <div className="item-catalog">
        <InfiniteScroll
          pullDownToRefresh
          pullDownToRefreshContent={
            <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
          }
          refreshFunction={this.refresh}
          next={this.fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {catalogItems.data && catalogItems.data.map((item, i) => (
            <Item 
              {...item}
              key={i}
              quantity={item.quantity && item.quantity}
            />
          ))}        
        </InfiniteScroll>        

      </div>
    )
  }
}
export default connect(mapDispatchToProps)(Catalog);
