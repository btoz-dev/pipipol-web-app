import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="footer-logo-pipipol">
          <a href="#">
            <img src="https://uploads.codesandbox.io/uploads/user/8a33cde4-3c2b-460f-8e6a-0515dce90c12/DDRA-logo-pipipol.png" />
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
