import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthService from '../services/AuthService';

import App from "../App";
import Daftar from "./Daftar";
import Login from "./Login";
import Profil from "./Profil";
import Redeem from "./Redeem";
import Error from "./Error";
import Polling from "./Polling";
import Footer from "./Footer";
import Test from "./Test";

const Router = () => (
  <div>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" component={App} exact />
          <Route path="/daftar" component={Daftar} />
          <Route path="/login" component={Login} />
          <Route path="/profil" component={Profil} />
          <Route path="/redeem" component={Redeem} />
          <Route path="/polling/:id" component={Polling} />
          <Route path="/test" component={Test} />
          <Route component={Error} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  </div>
);

export default Router;
