import React from 'react';

const FetauredPolling = props => (

      return (

        <div className="poll-card featured" style={{backgroundImage: "url(https://placeimg.com/640/480/any)"}}>
          <div className="poll-overlay"></div>
          <div className="poll-content">
            <div className="poll-category btn btn-outline">{props.firstpoll.kategori}</div>
            <div className="poll-copy">
              <h1>{ props.firstpoll.question }</h1>
              <p>It is a long established fact that a reader will be distracted by the readable content.</p>
            </div>
            <div className="poll-exp-date"><i className="far fa-calendar"><span>21</span></i>hari lagi</div>
            <div className="poll-value-point"><span className="value">{props.firstpoll.point}</span> <small>poin</small></div>
          </div>
          <div className="poll-btn-quickview"><i className="fas fa-search-plus"></i></div>
        </div>

      );

);

export default FetauredPolling;