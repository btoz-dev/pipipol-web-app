import React, { Component } from "react";

const BaseURL = "https://apipipipol.btoz.co.id";

class SearchToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      sortBy: 'popularity',
      filterBy: '',
      searchBy: ''
    };
    this.chooseFilterBy = this.chooseFilterBy.bind(this);
    this.clickApplySearchBy = this.clickApplySearchBy.bind(this);
  }

  componentDidMount = async () => {
    const api_get_categories = await fetch(BaseURL + "/api/getKategori");
    const data = await api_get_categories.json();
    this.setState({ 
      categories: data.list_kategori
    })
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
  chooseFilterBy(e) {   
    e.preventDefault() 
    this.setState({
      filterBy: e.currentTarget.dataset.value 
    })
    this.props.applyFilterBy(e.currentTarget.dataset.value );
  }
  clickApplySearchBy(e) {
    this.setState({
      searchBy: e.target.value
    }); 
    this.props.applySearchBy(e.target.value);
  }

  render() {

    const categories = this.state.categories;
    // const listCategories = categories.map(cat => (
    //   <option key={cat.id} value={cat.cat_name}>
    //     {cat.cat_name}
    //   </option>
    // ));
    const listCategories = categories.map(cat => (
      // <li onClick={this.handleCheck.bind(this)} data-id="1"><span>A</span> <p>{this.props.answers[0]}</p></li>
      <a key={cat.id} onClick={this.chooseFilterBy} data-value={cat.cat_name} className="dropdown-item" href="#">{cat.cat_name}</a>
    ));

    return(

      <div id="pollToolbar" className="poll-toolbar">
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <div className="input-group mt-3">
                <input onChange={this.clickApplySearchBy} type="text" className="form-control pl-4 pr-4" placeholder="Cari Polling.." aria-label="Cari Polling" />
                <div className="input-group-btn">
                  <button type="button" className="btn btn-dark pr-3 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Pilih Kategori <i class="fas fa-angle-down ml-1"></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a onClick={this.chooseFilterBy} data-value="" className="dropdown-item" href="#">Semua kategori</a>
                    {listCategories}
                  </div>
                </div>
              </div>

              {/* <div className="interactions">
                <input onChange={this.clickApplySearchBy} type="text" placeholder="Cari polling.." autocomplete="off" />
                <button onClick={this.onInitialSearch} type="submit">Search</button>
              </div>  */}

              {/* <div className="input-group mt-3">
                <select value={this.state.value} onChange={this.chooseFilterBy} className="custom-select pl-4" id="inputGroupSelect01">
                  <option value=''> Semua Kategori</option>
                  {listCategories}
                </select>
              </div> */}
            </div>
            <div className="col-md-5 col-sm-12">
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