import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import  { Redirect } from 'react-router-dom'

import AuthService from '../services/AuthService';

import App from "./../App";
import Daftar from "./Daftar";
import Login from "./Login";
import Profil from "./Profil";
import Redeem from "./Redeem";
import Error from "./Error";
import Polling from "./Polling";
import Footer from "./Footer";
import Test from "./Test";
import Search from "./Search";

import { NavLink } from "react-router-dom";
import logo from "./../img/logo-pipipol_black.png";
import userProfileImgDefault  from'./../img/ic-user.png';

import { slide as Menu } from 'react-burger-menu'

var scrollToElement = require('scroll-to-element');

const Auth = new AuthService();

const BaseURL = "https://apipipipol.btoz.co.id";



class Router extends Component {

  showSettings (event) {
    event.preventDefault();
  }

  constructor(props) {
    super(props);
    this.state = {
      userDetails: JSON.parse(localStorage.getItem('userDetails')),
      categories: [],
      sisaPoint: localStorage.getItem('sisaPoint'),
      currentPoint: localStorage.getItem('currentPoint'),
      menuOpen: false,
      isLoggedIn: false,
      loading: true,
      userAvatarUrl: localStorage.getItem('userAvatar')
    };
    this.clickScrollToElement = this.clickScrollToElement.bind(this);
  }


  componentDidMount = async () => {
    const api_get_categories = await fetch(BaseURL + "/api/getKategori");
    const data = await api_get_categories.json();
    this.setState({ 
      categories: data.list_kategori, 
      loading: false,
    })
  };

  handleLogout(){
    Auth.logout()
  }

  isLoggedIn() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
    
  }

  handleStateChange (state) {
    this.setState({menuOpen: state.isOpen})  
  }

  closeMenu () {
    this.setState({menuOpen: false})
  }

  toggleMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
  }
  
  clickScrollToElement(elm){
    scrollToElement(elm, {
      offset: -88,
      ease: 'inOutQuad',
      duration: 700
    });
  }
  
  render() {
    
    const userDetails = this.state.userDetails;
    const currentPoint = this.state.currentPoint
    // console.log("USER DETAIL HEADER")
    // console.log(userDetails)

    const categories = this.state.categories;
    const listCategories = categories.map(cat => (
      <option key={cat.id} value={cat.id}>
        {cat.cat_name}
      </option>
    ));

    // console.log("IS LOGGED IN ????????")
    // console.log(this.state.isLoggedIn)

    const isLoggedIn = localStorage.getItem('isLoggedIn')


    if( isLoggedIn ){

      // console.log("LOGGED IN")

      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('currentPoint', currentPoint)

      return (
          
        <div id="outer-container">
          <BrowserRouter>
            <div>
              <nav id="mainNav" className="navbar navbar-expand-sm navbar-dark bg-tr">
                <NavLink to="/" className="navbar-brand">
                  <img src={logo} alt="" />
                </NavLink>
                

                <div className="collapse navbar-collapse" id="navbar">
                  <ul className="navbar-nav ml-auto">
                    {/* <li className="nav-item active">
                      <a
                        href="#pollToolbar"
                        className="nav-link"
                        data-toggle="collapse"
                        role="button"
                        aria-expanded="false"
                        aria-controls="pollToolbar"
                      >
                        <i className="fas fa-search" />
                      </a>
                    </li> */}
                    <li className="nav-item">
                      <NavLink to="/" className="nav-link">
                        Home
                      </NavLink>
                    </li>
                    {/* <li className="nav-item hide">
                      <NavLink to="/search" className="nav-link">
                        Search
                      </NavLink>
                    </li> */}
                    <li className="nav-item nav-profile dropdown">
                      <NavLink to="/profil" className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                        <div className="avatar" style={{backgroundImage: "url("+this.state.userAvatarUrl+")" }}>
                          {this.state.userAvatarUrl === '"https://apipipipol.btoz.co.idnull"' ? <img className="img-fluid user-avatar-default" src={userProfileImgDefault} alt="" /> : ''}
                        </div>
                        <strong>{ this.state.currentPoint === "null" ? 0 : this.state.currentPoint }</strong> <small>pts</small> <i className="fas fa-angle-down ml-1"></i>
                      </NavLink>
                      <div className="dropdown-menu">
                        <NavLink to="/profil" className="dropdown-item" href="#">
                          <i className="fas fa-id-card mr-1"></i> Profil
                        </NavLink>
                        <NavLink to="/logout"  className="dropdown-item">
                          <i className="fas fa-sign-out-alt mr-1"></i> Logout 
                        </NavLink>
                      </div>
                    </li>
                    <li className="nav-item nav-redeem">
                      <NavLink to="/redeem" className="nav-link">
                      <i className="fas fa-exchange-alt mr-1"></i> Redeem
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </nav>
   
              

              {/* MOBILE MENU     */}
              <NavLink to="/profil" className="profile-point-mobile">
                {this.state.userAvatarUrl === '"https://apipipipol.btoz.co.idnull"' ? <div className="avatar"><img className="img-fluid user-avatar-default" src={userProfileImgDefault} alt="" /></div> : <div className="avatar" style={{backgroundImage: "url("+this.state.userAvatarUrl+")" }}/>}
                <div className="point-value">
                  <strong>{ this.state.currentPoint === "null" ? 0 : this.state.currentPoint }</strong> <small>pts</small>
                </div>
              </NavLink>
              <div className="bg-burger-menu"></div>
              <Menu isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)} right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } >
                {/* <a
                  href="#pollToolbar"
                  data-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="pollToolbar"
                  to="/" onClick={() => this.closeMenu()}><i className="fas fa-search mr-1"></i> Cari Polling
                </a> */}
                <NavLink to="/" onClick={() => this.closeMenu()}><i className="fas fa-home mr-1"></i> Home</NavLink>
                <NavLink to="/profil" onClick={() => this.closeMenu()}><i className="fas fa-user-alt mr-1"></i> Profile</NavLink>
                <NavLink to="/redeem" onClick={() => this.closeMenu()}><i className="fas fa-exchange-alt mr-1"></i> Redeem</NavLink>
                <NavLink to="/logout" onClick={() => this.closeMenu()}><i className="fas fa-sign-out-alt mr-1"></i> Logout</NavLink>
              </Menu>

              <main id="page-wrap">                 
                <Switch>
                  <Route path="/" component={Search} exact />
                  <Route path="/daftar" render={() => {
                      Auth.logout();
                    }}
                  />
                  <Route path="/login" component={Login} />
                  <Route path="/profil" component={Profil} />
                  <Route path="/redeem" component={Redeem} />
                  <Route path="/polling/:id" component={Polling} />
                  <Route path="/search" component={Search} />
                  <Route path="/test" component={Test} />
                  <Route path="/logout" render={() => {
                      Auth.logout();
                      return <Redirect to='/login'  />;
                    }}
                  />
                  <Route component={Error} />
                </Switch>
                <Footer />
              </main>

            </div>
          </BrowserRouter>
      </div>
      );
      
    }
    else if(!isLoggedIn){
      console.log("KELUAAAAARRRRRRR")
      return (
    <div>

          <BrowserRouter>
            <div>

              <nav className="navbar navbar-expand-sm navbar-dark bg-tr">
                <NavLink to="/" className="navbar-brand">
                  <img src={logo} alt="" />
                </NavLink>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbar"
                  aria-controls="navbar"
                  aria-expanded="false"
                  aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"><i className="fas fa-bars" /></span>
                </button>
                <NavLink to="/login" className="nav-login-mobile ">
                  <i className="fas fa-lock mr-1" /> Login
                </NavLink>
              </nav>

              <Switch>
                <Route path="/" component={Search} exact />
                <Route path="/polling/:id" render={() => {
                    return <Redirect to='/login'  />;
                  }}
                />
                <Route path="/daftar" component={Daftar} />
                <Route path="/login" component={Login} />
                <Route path="/logout" render={() => {
                    Auth.logout();
                    return <Redirect to='/login'  />;
                    }}
                />
                <Route component={Error} />
              </Switch>

              <Footer />

            </div>
          </BrowserRouter>


  </div>
      );
    }
  }
  


  // render() {
  //   return (
  //     <div>
  //       <BrowserRouter>
  //         <div>
  //           <Header test={this.state.test} />
  //           <Switch>
  //             <Route path="/" component={App} exact />
  //             <Route path="/daftar" component={Daftar} />
  //             <Route path="/login" component={Login} />
  //             <Route path="/profil" component={Profil} />
  //             <Route path="/redeem" component={Redeem} />
  //             <Route path="/polling/:id" component={Polling} />
  //             <Route path="/test" component={Test} />
  //             <Route component={Error} />
  //           </Switch>
  //           <Footer />
  //         </div>
  //       </BrowserRouter>
  //     </div>
  //   );
  // }
}

export default Router;
