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
import { NavLink } from "react-router-dom";
import logo from "./../img/logo-pipipol_black.png";

import { slide as Menu } from 'react-burger-menu'

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
      isLoggedIn: false,
      loading: true
    };
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
  
  render() {
    
    const userDetails = this.state.userDetails;
    const currentPoint = this.state.currentPoint
    console.log("USER DETAIL HEADER")
    console.log(userDetails)

    const categories = this.state.categories;
    const listCategories = categories.map(cat => (
      <option key={cat.id} value={cat.id}>
        {cat.cat_name}
      </option>
    ));

    console.log("IS LOGGED IN ????????")
    console.log(this.state.isLoggedIn)

    const isLoggedIn = localStorage.getItem('isLoggedIn')


    if( isLoggedIn ){

      console.log("LOGGED IN")

      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('currentPoint', currentPoint)

      return (
          
        <div id="outer-container">
          <BrowserRouter>
            <div>
              <nav className="navbar navbar-expand-sm navbar-dark bg-tr">
                <NavLink to="/" className="navbar-brand">
                  <img src={logo} alt="" />
                </NavLink>
                

                <div className="collapse navbar-collapse" id="navbar">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
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
                    </li>
                    <li className="nav-item">
                      <NavLink to="/" className="nav-link">
                        Home
                      </NavLink>
                    </li>
                    {/* <li className="nav-item hide">
                      <NavLink to="/test" className="nav-link">
                        Test
                      </NavLink>
                    </li> */}
                    <li className="nav-item nav-profile dropdown">
                      <NavLink to="/profil" className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                        <div
                          className="avatar"
                          style={{
                            backgroundImage: "url("+BaseURL+userDetails.avatar+")" 
                          }}
                        />
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
   
              <div id="pollToolbar" className="poll-toolbar collapse">
                <div className="container">
                <div className="row">
                  <div className="col-md-8 col-sm-12">
                    <div className="input-group mt-3">
                      <select className="custom-select" id="inputGroupSelect01">
                        {listCategories}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <div className="row">
                      <div className="col-6">
                        <NavLink
                          to="#"
                          className="btn btn-red mb-3 mt-3"
                          href="#"
                          role="button"
                        >
                          Populer
                        </NavLink>
                      </div>
                      <div className="col-6">
                        <NavLink
                          to="#"
                          className="btn btn-outline mb-3 mt-3"
                          href="#"
                          role="button"
                        >
                          Terbaru
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* MOBILE MENU     */}
              <NavLink to="/profil" className="profile-point-mobile">
                <div className="avatar" style={{backgroundImage: "url("+BaseURL+userDetails.avatar+")" }}
                />
                <strong>{ this.state.currentPoint === "null" ? 0 : this.state.currentPoint }</strong> <small>pts</small>
              </NavLink>
              <div className="bg-burger-menu"></div>
              <Menu right pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } >
                <NavLink to="/" className="menu-item"><i className="fas fa-home mr-1"></i> Home</NavLink>
                <NavLink to="/profil" className="menu-item"><i className="fas fa-user-alt mr-1"></i> Profile</NavLink>
                <NavLink to="/redeem" className="menu-item"><i className="fas fa-exchange-alt mr-1"></i> Redeem</NavLink>
                <NavLink to="/logout" className="menu-item"><i className="fas fa-sign-out-alt mr-1"></i> Logout</NavLink>
              </Menu>

              <main id="page-wrap">                 
                <Switch>
                  <Route path="/" component={App} exact />
                  <Route path="/daftar" render={() => {
                      Auth.logout();
                    }}
                  />
                  <Route path="/login" component={Login} />
                  <Route path="/profil" component={Profil} />
                  <Route path="/redeem" component={Redeem} />
                  <Route path="/polling/:id" component={Polling} />
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
                <NavLink to="/login" className="nav-login-mobile hidden-sm-up">
                  <i className="fas fa-lock mr-1" /> Login
                </NavLink>
              </nav>

              <Switch>
                <Route path="/" component={App} exact />
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
