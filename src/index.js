import React from "react";
import ReactDOM from "react-dom";
import Router from "./components/Router";
import registerServiceWorker from "./registerServiceWorker";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./_html/css/style.css";

const AUTH_TOKEN = localStorage.getItem('id_token');

console.log("AXIOS AUTH_TOKEN ")
console.log(AUTH_TOKEN)

axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/https://apipipipol.btoz.co.id';
axios.defaults.headers.common['x-access-token'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksI…jM4fQ.n0eQWET-FjzCdpjNh79zIf_lPX_fxpH5XpVLideknrQ';

const TopMostParent = ReactDOM.render(<Router />, document.getElementById("root"));
window.updateTopMostParent = (isLoggedIn, userDetails, currentPoint, userAvatarUrl) => {
	// Update state of topmost parent when this method is called 
	if(isLoggedIn === "" && userDetails === "" ){
		console.log("1")
		TopMostParent.setState({ 
				currentPoint: currentPoint 
		}); 
	}else if(userDetails === "" && currentPoint === ""){
		console.log("2")
		TopMostParent.setState({ 
				isLoggedIn: isLoggedIn
		}); 
	}else{
		console.log("4")
		TopMostParent.setState({ 
			isLoggedIn: isLoggedIn,
			userDetails: userDetails,
			currentPoint: currentPoint,
			userAvatarUrl: userAvatarUrl
		}); 
	}
};
registerServiceWorker();