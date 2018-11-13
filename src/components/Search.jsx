import React from "react";
import axios from "axios"
import sort from 'fast-sort';

import { ToastContainer, toast } from 'react-toastify';

import SearchToolBar from './SearchToolBar';
import PollingFirst from './PollingFirst';
import PollingMain from './PollingMain';
import PollingFeeds from './PollingFeeds';

var scrollToElement = require('scroll-to-element');

const applyUpdateResult = (result, sortBy) => prevState => ({
  list_polls: sort([...prevState.list_polls, ...result.list_polls]).desc(sortBy),
  page: prevState.page + 1
});

const applySetResult = (result, sortBy) => prevState => ({
  list_polls: sort(result.list_polls).desc(sortBy),
  page: prevState.page + 1
});

const getPollsAPI = (limit, page, sortBy, kategori, searchBy) =>
  `https://apipipipol.btoz.co.id/api/getPolls?page=${page}&limit=${limit}&kategori=${kategori}&search=${searchBy}`;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: [],
      allPolls: [],
      list_polls: [],
      firstPoll: [],
      mainPolls: [],
      page: 1,
      limit: 12,
      kategori: '',
      sortBy: 'popularity',
      searchBy: '',
      noMorePolls: false,
      loading: true
    };
    this.applySortBy = this.applySortBy.bind(this);
    this.applyFilterBy = this.applyFilterBy.bind(this);
    this.applySearchBy = this.applySearchBy.bind(this);
    this.pollingFeeds = React.createRef();
  }

  // LOAD AWAL
  componentDidMount() {
    this.onInitialSearch()
    
    scrollToElement('#topPage', {
      offset: -88,
      ease: 'inOutQuad',
      duration: 700
    });
  }

  onInitialSearch = e => {
    console.log("KATEGORI")
    console.log(this.state.kategori)

      // RESET 
    if(this.state.kategori !== '' && this.state.page !== 1){
      this.setState({
        page: 1,
        noMorePolls: false
      }, () => {
        this.fetchStories(this.state.limit, this.state.page, this.state.sortBy, this.state.kategori, this.state.searchBy);
      });
    }
    if(this.state.page >= 1 ){
      this.setState({
        page: 1,
        noMorePolls: false
      }, () => {
        console.log('SEARCH BY')
        console.log(this.state.serachBy)
        this.fetchStories(this.state.limit, this.state.page, this.state.sortBy, this.state.kategori, this.state.searchBy);
      });
    }
  };

  onPaginatedSearch = e => {
    this.fetchStories(this.state.limit, this.state.page, this.state.sortBy, this.state.kategori, this.state.searchBy);
  }

  fetchStories = (limit, page, sortBy, kategori, searchBy) => {

    

    fetch(getPollsAPI(limit, page, sortBy, kategori, searchBy))
      .then(response => response.json())
      .then(result => {

        // console.log("PAGE")
        // console.log(page)

        // console.log("LIST RESULT")
        // console.log(result.list_polls)

        // console.log("LIST POLLS AWAL")
        // console.log(this.state.list_polls)

        console.log("RESULT LENGTH")
        console.log(result.list_polls.length);

        let searchResult = result.list_polls.length
        if(searchResult === 0){
          this.notifyError("Maaf, tidak ada hasil pencarian yang sesuai dengan keyword tersebut. Silahkan coba lagi dengan keyword yang lain")  
          return
        }

        this.onSetResult(result, page, sortBy, kategori, searchBy);

        if(page === 1){
          let allPolls = sort(result.list_polls).desc(this.state.sortBy)
          let firstPoll = allPolls[0]
          let mainPolls = allPolls.slice(1,5)

          this.setState({
            firstPoll: firstPoll,
            mainPolls: mainPolls,
            loading: false
          })
        }
        // console.log(result.list_polls.length);
        // console.log("LIST POLLS UPDATE")
        // console.log(this.state.list_polls)

        if (result.list_polls.length < limit) {
          this.setState({
            noMorePolls: true
          });
        }
        
      });
  };

  onSetResult = (result, page, sortBy, kategori, searchBy) =>
    page === 1
      ? this.setState(applySetResult(result, sortBy))
      : this.setState(applyUpdateResult(result, sortBy));




  applySortBy(sortBy){
    scrollToElement('#pollingFeeds', {
      offset: -88,
      ease: 'inOutQuad',
      duration: 700
    });
    this.setState({
      sortBy: sortBy,
      list_polls: sort(this.state.list_polls).desc(sortBy),
      // firstPoll: sort(this.state.list_polls[0]).desc('popularity'),
      // mainPolls: sort(this.state.list_polls).desc('popularity').slice(1,5)
    })
  }
  applyFilterBy(filterBy){
    // window.location.reload();
    this.setState({
      kategori: filterBy
    }, () => {
        this.onInitialSearch();
    });
  }
  applySearchBy(searchBy) {    
    console.log(searchBy)
    this.setState({
      searchBy: searchBy
    }, () => {
      this.onInitialSearch();
    });
  }

  notify = (msg) => {
    toast(msg, {
      position: toast.POSITION.TOP_CENTER,
      className: 'pipipol-notify',
      autoClose: 7000
    });
  };
  notifyError = (msg) => {
    toast.error(msg, {
        position: toast.POSITION.TOP_CENTER,
        className: 'pipipol-notify',
        autoClose: 7000
    });
  };

  render() {
    const noMorePolls = this.state.noMorePolls

    let sortByName = this.state.sortBy
    
    if(sortByName === "popularity"){
      sortByName = "Popularitas"
    }else if(sortByName === "polls_id"){
      sortByName = "Polling Terkini"
    }

    return (
      <div id="topPage">

        <ToastContainer />

        <SearchToolBar applySearchBy={this.applySearchBy} applyFilterBy={this.applyFilterBy} applySortBy={this.applySortBy} />

        <div className="site-content">
          <div className="bg-container">
            <div className="poll-grids container-fluid pb-3">

              {/* <div className="interactions">
                <input onChange={this.applySearchBy} type="text" placeholder="Cari polling.." autocomplete="off" />
                <button onClick={this.onInitialSearch} type="submit">Search</button>
              </div> */}

              <div className="row no-gutters">
                <PollingFirst firstPoll={this.state.firstPoll} />
                <PollingMain  mainPolls={this.state.mainPolls} />
              </div>

            </div>

            <div id="pollingFeeds" className="poll-grids-container">
              <div className="poll-grids-title">
                <h2 className="text-center">
                  <strong>
                    Polling {this.state.kategori} lainnya berdasarkan <span className="text-red">{sortByName}</span>
                  </strong>
                </h2>
              </div>
              <div className="poll-grids container-fluid">

                <PollingFeeds ref={this.pollingFeeds}
                allPolls={this.state.list_polls.slice(5)}
                page={this.state.page}
                onPaginatedSearch={this.onPaginatedSearch}
                />

                {!noMorePolls && (
                <button onClick={this.onPaginatedSearch} className="btn btn-lg btn-danger loadmore pl-5 pr-5 mt-5 mb-5 mx-auto d-block">
                  {this.state.loading && (<i className="fas fa-spinner fa-spin mr-1" />)} Tampilkan lebih banyak
                </button>
                )}
              </div>
            </div>
              
          </div>
        </div>

        {/* <div id="pollToolBarBottom">
          <SearchToolBar applyFilterBy={this.applyFilterBy} applySortBy={this.applySortBy} />
        </div> */}
      
      </div>

    );
  }
}



export default Search;
