import React from "react";
import { Link } from "react-router-dom";

const PollingFirst = ({ firstPoll }) => (

  <div className="col-md-5 col-sm-12">
    <div className="poll-card featured" style={{ backgroundImage:"url(https://api.pipipol.com" + firstPoll.image + ")" }}>
      <div className="poll-overlay" />
      <div className="poll-content">
        <div className="poll-category btn btn-outline">
          {firstPoll.kategori}
        </div>
        <div className="poll-copy">
          <h1>{firstPoll.title}</h1>
          <p>{firstPoll.question}</p>
        </div>
        <div className="poll-exp-date">
          <i className="far fa-calendar">
            <span>{firstPoll.expired}</span>
          </i>hari lagi
        </div>
        <div className="poll-value-point">
          <span className="value">{firstPoll.point}</span>{" "}
          <small>poin</small>
        </div>
      </div>
      <Link to={{ pathname: `/polling/${firstPoll.slug}`, state: { polling: firstPoll.polls_id } }} className="poll-btn-quickview">
        <i className="fas fa-search-plus" />
      </Link>
    </div>
  </div>

)
export default PollingFirst