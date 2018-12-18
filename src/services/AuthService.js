import decode from 'jwt-decode';
import axios from "axios";
const BaseURL = "https://api.pipipol.com";

export default class AuthService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || BaseURL // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    login(username, password) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}/api/userLogin`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            console.log(res)
            this.setUserID(res.userid)
            this.setUserData(res)
            this.setToken(res.token) // Setting the token in localStorage
            this.isLoggedIn(res.token)
            // this.getSetUserDetails(res.userid)
            return Promise.resolve(res);
        })
    }
    

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isLoggedIn(token) {
        // Saves user data to localStorage
        localStorage.setItem('isLoggedIn', token)
    }

    getSetUserDetails(userid){
        axios.get(`/api/getUserDetails/`+userid)
        .then(res => {
            
            let userDetails = JSON.stringify(res.data.user_details[0])
            // console.log(userDetails)
            // localStorage.setItem('userDetails', userDetails)
        })
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setUserID(userID){
        localStorage.setItem('userid', JSON.stringify(userID))
    }

    setUserData(userData){
        // Saves user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData))
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        // localStorage.removeItem('id_token');
        // localStorage.removeItem('userData');
        // localStorage.removeItem('userDetails');
        // localStorage.removeItem('userid');
        // localStorage.removeItem('isLoggedIn');
        // localStorage.removeItem('sisaPoint');
        // localStorage.removeItem('currentPoint');
        // localStorage.removeItem('userAvatar');
        // localStorage.removeItem('loginType');

        localStorage.clear()
        sessionStorage.clear();
        
        

        // KASIH TAU SI ROUTER KLO UDAH SIGN OUT
        window.updateTopMostParent(false, "", ""); 

        // REDIRECT TO
        // this.props.history.replace('/');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }

    fetch(url, options) {
        
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.getToken()
        }

        console.log(this.loggedIn())

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            console.log("MASIH LOGIN NIHHHHHH")
            headers['x-access-token'] = this.getToken()
            // headers['Authorization'] = 'Bearer ' + this.getToken()
        }else{
            console.log("LOGIN NIHHHHHH")
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}