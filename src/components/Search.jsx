import React from "react";
import axios from "axios"
import sort from 'fast-sort';

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
  list_polls: sort(result.list_polls.slice(6)).desc(sortBy),
  page: prevState.page + 1
});

const getHackerNewsUrl = (limit, page) =>
  `https://apipipipol.btoz.co.id/api/getPolls?page=${page}&limit=${limit}`;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: [],
      allPolls: [],
      list_polls: [],
      firstPoll: [],
      mainPolls: [],
      page: null,
      limit: 13,
      sortBy: 'popularity',
      noMorePolls: false,
      loading: true
    };
    this.applySortBy = this.applySortBy.bind(this);
    this.applyFilterBy = this.applyFilterBy.bind(this);
    this.pollingFeeds = React.createRef();
  }

  // LOAD AWAL
  componentDidMount() {
    // this.onInitialSearch()
  }

  componentDidMount = async () => {
    axios
    .get(`/api/getPolls?page=${this.state.page}&limit=${this.state.limit}`)
    .then(result => {
      let allPolls = sort(result.data.list_polls).desc(this.state.sortBy)
      let firstPoll = allPolls[0]
      let mainPolls = allPolls.slice(1,5)
      this.setState({ 
        result: allPolls,
        allPolls: allPolls,
        firstPoll: firstPoll,
        mainPolls: mainPolls
      })
      console.log("SORTTTTTT")
      console.log(this.state.list_polls);
    })
  };

  onInitialSearch = e => {
    this.fetchStories(this.state.limit, this.state.page, this.state.sortBy);
  };

  onPaginatedSearch = e => {
    this.fetchStories(this.state.limit, this.state.page, this.state.sortBy);
  }

  fetchStories = (limit, page, sortBy) => {
    console.log(page);
    fetch(getHackerNewsUrl(limit, page, sortBy))
      .then(response => response.json())
      .then(result => {
        // console.log(result.list_polls.length);
        this.onSetResult(result, page, sortBy);

        let allPolls = sort(result.list_polls).desc(this.state.sortBy)
        let firstPoll = allPolls[0]
        let mainPolls = allPolls.slice(1,5)
        this.setState({
          result: result,
          // allPolls: allPolls,
          // firstPoll: firstPoll,
          // mainPolls: mainPolls,
          loading: false
        })
        console.log(this.state.firstPoll)
        if (result.list_polls.length < limit) {
          this.setState({
            noMorePolls: true
          });
        }
      });
  };

  onSetResult = (result, page, sortBy) =>
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
      list_polls: sort(this.state.list_polls).desc(filterBy),
      // firstPoll: sort(this.state.list_polls[0]).desc(this.state.sortBy),
      // mainPolls: sort(this.state.list_polls).desc(this.state.sortBy).slice(1,5)
    })
    // this.fetchStories(this.state.limit, 0, this.state.sortBy);
  }

  render() {
    const noMorePolls = this.state.noMorePolls

    let sortByName = this.state.sortBy
    
    if(sortByName === "popularity"){
      sortByName = "Popularitas"
    }else if(sortByName === "polls_id"){
      sortByName = "Polling Terkini"
    }

    return (
      <div>

        <SearchToolBar applyFilterBy={this.applyFilterBy} applySortBy={this.applySortBy} />

        <div className="site-content">
          <div className="bg-container">
            <div className="poll-grids container-fluid pb-3">

              {/* <div className="interactions">
                <form type="submit" onSubmit={this.onInitialSearch}>
                  <input type="text" ref={node => (this.input = node)} />
                  <button type="submit">Search</button>
                </form>
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
                    Polling lainnya berdasarkan <span className="text-red">{sortByName}</span>
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

        <div id="pollToolBarBottom">
          <SearchToolBar applyFilterBy={this.applyFilterBy} applySortBy={this.applySortBy} />
        </div>
      
      </div>

    );
  }
}



export default Search;
