import React from "react";
import { Link } from "react-router-dom";

const PollingMain = ({ mainPolls }) => (

  <div className="col-md-7 col-sm-12">
    <div className="row no-gutters">
      
      {mainPolls.map(polling => (
      <div key={polling.polls_id} className="col-lg-6 col-md-12 col-sm-6 col-xs-12">
        <div className="poll-card" style={{ backgroundImage: "url(https://api.pipipol.com" + polling.image + ")" }}>
          <div className="poll-overlay" />
          <div className="poll-content">
            <div className="poll-copy">
              <h1>{polling.title}</h1>
              <p>
                {polling.question.length < 25
                  ? `${polling.question}`
                  : `${polling.question.substring(0, 30)}...`}
              </p>
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

    </div>
  </div>
)
export default PollingMain;