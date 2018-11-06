import React from "react";
import ReactDOM from "react-dom";
import Router from "./components/Router";
import registerServiceWorker from "./registerServiceWorker";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./_html/css/style.css";

const AUTH_TOKEN = localStorage.getItem('id_token');

axios.defaults.baseURL = 'http://apipipipol.btoz.co.id';
axios.defaults.headers.common['x-access-token'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksI…jM4fQ.n0eQWET-FjzCdpjNh79zIf_lPX_fxpH5XpVLideknrQ';

const TopMostParent = ReactDOM.render(<Router />, document.getElementById("root"));
window.updateTopMostParent = (userDetails, currentPoint) => {
    // Update state of topmost parent when this method is called 
    if(userDetails === ""){
        TopMostParent.setState({ 
            currentPoint: currentPoint 
        }); 
    }else{
        TopMostParent.setState({ 
            userDetails: userDetails,
            currentPoint: currentPoint 
        }); 
    }

};
registerServiceWorker();