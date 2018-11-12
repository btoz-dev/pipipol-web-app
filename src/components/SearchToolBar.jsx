import React, { Component } from "react";

const BaseURL = "https://apipipipol.btoz.co.id";

class SearchToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      sortBy: 'popularity'
    };
  }

  componentDidMount = async () => {
    const api_get_categories = await fetch(BaseURL + "/api/getKategori");
    const data = await api_get_categories.json();
    this.setState({ 
      categories: data.list_kategori
    })
    this.handleChange = this.handleChange.bind(this);
  };

  clickApplySortByPopular = () => {
    this.props.applySortBy('popularity');
    this.setState({
      sortBy: 'popularity'
    })
  }
  clickApplySortByLatest = () => {
    this.props.applySortBy('polls_id');
    this.setState({
      sortBy: 'polls_id'
    })
  }

  handleChange(event) {    
    this.props.applyFilterBy(event.target.value);
  }

  render() {

    const categories = this.state.categories;
    const listCategories = categories.map(cat => (
      <option key={cat.id} value={cat.cat_name}>
        {cat.cat_name}
      </option>
    ));

    return(

      <div id="pollToolbar" className="poll-toolbar">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-sm-12">
              <div className="input-group mt-3">
                <select value={this.state.value} onChange={this.handleChange} className="custom-select pl-4" id="inputGroupSelect01">
                  <option value=''> Pilih kategori..</option>
                  {listCategories}
                </select>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="row">
                <div className="col-6">
                  <button className="btn btn-red mb-3 mt-3" onClick={this.clickApplySortByPopular}>
                    {this.state.sortBy === 'popularity' ? <i class="fas fa-check mr-1"></i> : ''} Populer
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline mb-3 mt-3" onClick={this.clickApplySortByLatest}>
                    {this.state.sortBy === 'polls_id' ? <i class="fas fa-check mr-1"></i> : ''} Terkini
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    )
  }
}
export default SearchToolBar