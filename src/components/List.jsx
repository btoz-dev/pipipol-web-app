import React, { Component } from 'react';
import axios from "axios";
import { createFilter } from '../util/Filter';
import { createSorter } from '../util/Sort';

const BaseURL = `https://api.pipipol.com`;

class List extends Component {
  state = {
    AUTH_TOKEN: localStorage.getItem("id_token"),
    filters: this.props.filters,
    sorters: this.props.sorters,
  };

  // static defaultProps = {
  //   filters: [{
  //     property: '',
  //     value: ''
  //   }, {
  //     property: '',
  //     value: ''
  //   }],

  //   sorters: [{
  //     property: 'polls_id',
  //     direction: 'DESC'
  //   }, {
  //     property: ''
  //   }]
  // }

  // componentDidMount () {
  //   fetch(BaseURL + "/api/getPolls")
  //     .then(res => res.json())
  //     .then(this.onLoad);
  // }

  searchPollsByCat(cat){
    console.log(cat)
    let category = cat;

   

    axios.get(BaseURL + `/api/searchPolls/` + category, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Cache-Control': 'no-cache',
        'x-access-token': this.state.AUTH_TOKEN,
      },
      credentials: 'include',
    })
    .then(this.onLoad);
  }

  parseData (data) {
    const { sorters } = this.state;

    if (data && data.length && Array.isArray(sorters) && sorters.length) {
      data.sort(createSorter(...sorters));
    }

    return data;
  }

  onLoad = (data) => {
    this.setState({
      data: this.parseData(data)
    });
    console.log(this.state.data)
  }

  render () {
    const { data } = this.state;

    return data ?
      this.renderData(data) :
      this.renderLoading();
  }

  renderData (data) {
    if (data && data.length > 0) {
      const { filters } = this.state;

      if (Array.isArray(filters) && filters.length) {
        data = data.filter(createFilter(...filters));
      }

      return (
        <div>
          
          {
            data.map(item => (
              <div key={item.id} className="text-center">
                <h5 className="mb-0">{item.title}</h5>
                <div className="mb-3">{item.kategori}</div>
              </div>
            ))
          }
        </div>
      );
    } else {
      return <div>No items found</div>;
    }
  }

  renderLoading () {
    return <div>Loading...</div>;
  }

  
  
}

export default List;
