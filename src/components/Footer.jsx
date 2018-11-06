import React from "react";
import logoPipipol  from'./../img/logo-pipipol.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="footer-logo-pipipol">
          <a href="#">
            <img src={logoPipipol} />
          </a>
        </div>
        <div className="sosmed">
          <a href="#">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#">
            <i className="fab fa-twitter" />
          </a>
          <a href="#">
            <i className="fab fa-instagram" />
          </a>
          <a href="#">
            <i className="fab fa-youtube" />
          </a>
          <a href="#">
            <i className="fab fa-linkedin" />
          </a>
        </div>
      </div>
      <div className="copyright">@ 2018 Pipipol. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
