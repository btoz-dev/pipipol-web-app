import React, { Component } from "react";
import { Link } from "react-router-dom";





class PollingFeeds  extends Component{

  constructor(props) {
    super(props);
  }

  onPaginatedSearch = (props) => {
    this.props.onPaginatedSearch();
  }

  render(){
  
    return(

      <div className="row no-gutters">

        {this.props.allPolls.map(polling => (
          <div key={polling.polls_id} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="poll-card" style={{ backgroundImage: "url(https://api.pipipol.com" + polling.image + ")" }}>
              <div className="poll-overlay" />
              <div className="poll-content">
                <div className="poll-copy">
                  <h1>{polling.title}</h1>
                  <p />
                  <div className="poll-category btn btn-outline">
                    {polling.kategori}
                  </div>
                </div>
                <div className="poll-exp-date">
                  <i className="far fa-calendar">
                    <span>{polling.expired}</span>
                  </i>hari lagi
                </div>
                <div className="poll-value-point">
                  <span className="value">{polling.point}</span>{" "}
                  <small>poin</small>
                </div>
              </div>
              <Link to={{ pathname: `/polling/${polling.slug}`, state: { polling: polling.polls_id } }} className="poll-btn-quickview">
                <i className="fas fa-search-plus" />
              </Link>
            </div>
          </div>
        ))}

          {!this.props.noMorePolls && (
          <div className="col-load-more col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="poll-card">
              <button onClick={this.onPaginatedSearch} className="poll-btn-quickview">
                <i className="fas fa-angle-right" />
                <h4>Polling Lainnya</h4>
              </button>
            </div>
          </div>
          )}

      </div>
    )
  }
}
export default PollingFeeds;