import React from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

let BaseURL = "https://api.pipipol.com/";

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pollings: [],
      visible: 13,
      error: false,
      loading: true
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    this.setState(prev => {
      return { visible: prev.visible + 12 };
    });
  }

  componentDidMount() {
    fetch(
      BaseURL + "api/getPolls?page=1&limit=100"
    )
      .then(res => res.json())
      .then(res => {
        this.setState({
          pollings: res.list_polls,
          loading: false
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          error: true
        });
      });
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loader />;
    }
    return (
      <div className="row no-gutters">
        {this.state.pollings
          .slice(5, this.state.visible)
          .map((polling, index) => {
            return (
              <div
                key={polling.polls_id}
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              >
                <div
                  className="poll-card"
                  style={{
                    backgroundImage:
                      "url(https://api.pipipol.com" + polling.image + ")"
                  }}
                >
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
                  <Link
                    to={{
                      pathname: `/polling/${polling.slug}`,
                      state: { polling: polling.polls_id }
                    }}
                    className="poll-btn-quickview"
                  >
                    <i className="fas fa-search-plus" />
                  </Link>
                </div>
              </div>
            );
          })}

        {this.state.visible < this.state.pollings.length && (
          <button
            onClick={this.loadMore}
            className="btn btn-lg btn-danger loadmore pl-5 pr-5 mt-5 mb-5 mx-auto"
          >
            Tampilkan lebih banyak
          </button>
        )}
      </div>
    );
  }
}
export default Feed;
//   ReactDOM.render(<Feed />, document.getElementById('feed'));
