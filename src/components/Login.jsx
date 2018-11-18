import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";
import AuthService from '../services/AuthService';
import md5 from "md5";
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {PostData} from './../services/PostData';
import { ToastContainer, toast } from 'react-toastify';
import bgRedeem  from'./../img/bg-redeem.jpg';
import logoPipipol  from'./../img/logo-pipipol.png';
import userProfileImgDefault  from'./../img/ic-user.png';

const qs = require('query-string');

const BaseURL = "https://apipipipol.btoz.co.id";

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            loginMessage: '',
            loading: false,
            loginType: '',
            loadingGoogle: false,
            loadingFacebook: false,
            loginError: false,
            redirect: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();

        this.signup = this.signup.bind(this);
    }

    encodedData(data) {
        return Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
    }

    signup(res, type) {
        let postData;

        // FACEBOOK
        if (type === 'facebook') {

            this.setState({ 
                loginType: 'social',
                loadingFacebook: true
            })

            let email = res.email
            if(email === undefined){
                email = res.first_name.toLowerCase()+res.last_name.toLowerCase()
            }

            postData = {
                email: email,
                name: res.name,
                fbuserid: res.userID,
                
                // provider: type,
                // token: res.accessToken,
                // provider_pic: res.picture.data.url
            };
            if (postData) {

                localStorage.setItem("id_token", res.accessToken);

                let facebookAvatarUrl = res.picture.data.url
       
                axios
                .post(`/api/facebookAuth`, this.encodedData(postData))
                .then(res => {

                    // console.log(res);
                    console.log("RESULT DATA");
                    console.log(res.data);
                    // console.log(res.data.message)

                    let userData = res.data;
                    let loggedIn = userData.login
                    let userid = userData.userid;
                    let token = userData.token;
                    let msg = userData.message;

                    if(loggedIn){
                        this.Auth.setUserID(userid)
                        this.Auth.setUserData(userData)
                        this.Auth.setToken(token) // Setting the token in localStorage
                        this.Auth.isLoggedIn(token)

                        localStorage.setItem('loginType', 'social')

                        this.getUserDetails(userid, facebookAvatarUrl)
                        this.setState({
                            loadingFacebook: false,
                            redirect: true
                        });
                    }else{
                        this.notifyError(msg);
                        this.setState({
                            loading: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }

        // GOOGLE
        if (type === 'google' && res.w3.U3) {

            let googleAvatarUrl = res.profileObj.imageUrl

            this.setState({ 
                loginType: 'social',
                loadingGoogle: true 
            })

            postData = {
                idtoken: res.Zi.id_token
            };
            
            
            if (postData) {

                localStorage.setItem("id_token", postData.idtoken);
       
                axios
                .post(`/api/googleAuth`, this.encodedData(postData))
                .then(res => {

                    // console.log(res);
                    console.log("RESULT DATA");
                    console.log(res.data);
                    // console.log(res.data.message)

                    let userData = res.data;
                    let loggedIn = userData.login
                    let userid = userData.userid;
                    let token = userData.token;
                    let msg = userData.message;

                    if(loggedIn){
                        this.Auth.setUserID(userid)
                        this.Auth.setUserData(userData)
                        this.Auth.setToken(token) // Setting the token in localStorage
                        this.Auth.isLoggedIn(token)

                        localStorage.setItem('loginType', 'social')

                        this.getUserDetails(userid, googleAvatarUrl)
                        this.setState({
                            loadingGoogle: false,
                            redirect: true
                        });
                    }else{
                        this.notifyError(msg);
                        this.setState({
                            loading: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    }
    
    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }

    handleChange(e){
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleFormSubmit(e){
        e.preventDefault();

        this.setState({
            loading: true
        })

        let passwordMD5 = md5(this.state.password);
      
        this.Auth.login(this.state.username, passwordMD5)
            .then((res) => {
                // console.log(res)
                const userid = res.userid
                const loggedIn = res.login
                const msg = res.message
                this.setState({
                    loginMessage: msg
                })
                if(loggedIn){
                    this.getUserDetails(userid)
                }else{
                    this.notifyError();
                    this.setState({
                        loading: false
                    })
                }
            })
            .catch(err =>{
                alert(err);
            })
    }
    

    getUserDetails(userid, googleAvatarUrl){
        axios.get(`/api/getUserDetails/`+userid)
        .then(res => {
            let userDetails = JSON.stringify(res.data.user_details[0])
            let currentPoint = JSON.stringify(res.data.user_details[0].point)
            let userAvatar = JSON.stringify(res.data.user_details[0].avatar)
            let userAvatarUrl = JSON.stringify(BaseURL+res.data.user_details[0].avatar)
            console.log("USER AVATAR DAPAT PAS LOGIN:")
            console.log(userAvatar)

            localStorage.setItem('userDetails', userDetails)
            localStorage.setItem('currentPoint', currentPoint)

            if(userAvatar === 'undefined' || userAvatar === 'null'){
                localStorage.setItem('userAvatar', userProfileImgDefault)
                if(this.state.loginType === 'social'){
                    localStorage.setItem('userAvatar', googleAvatarUrl)
                    userAvatarUrl = googleAvatarUrl
                }else{
                    localStorage.setItem('userAvatar', userProfileImgDefault)
                    userAvatarUrl = userProfileImgDefault
                }
            }else{
                localStorage.setItem('userAvatar', userAvatarUrl)
            }

            // KIRIM STATES KE TOP MOST PARENT PARAMNYA: (isLoggedIn, userDetails, currentPoint)
            window.updateTopMostParent("true", userDetails, currentPoint, userAvatarUrl); 

            this.setState({
                loading: false
            })

            this.props.history.replace('/');
        })
    }

    notifyError = () => {
        toast.error(this.state.loginMessage, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };

    notifyErrorAPI = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };



    render() {

        if (this.state.redirect || sessionStorage.getItem('userData')) {
            return (<Redirect to={'/'}/>)
        }

        const responseFacebook = (response) => {
            console.log("facebook console");
            console.log(response);
            this.signup(response, 'facebook');
        }
        
        const responseGoogle = (response) => {
            console.log("google console");
            console.log(response);
            this.signup(response, 'google');
        }

        return (
            <div
                className="site-content container-fluid"
                style={{
                backgroundImage:
                    "url("+bgRedeem+")"
                }}
            >
                <ToastContainer />
                <div className="bg-container container-fluid pb-3">
                    <section className="login container">
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-6 my-auto">
                                <div className="login-copy text-center">
                                    <div className="mb-3"><a href="./"><img src={logoPipipol} alt="Pipipol" /></a></div>
                                    {/* <p>Lorem ipsum dolor sit amet, quaestio philosophia eu quo, eum movet delectus deterruisset no. Soluta civibus patrioque et nec. Qui alii doming postulant ex. Fuisset honestatis ut eam, illud voluptatum per et. Ut sit iusto virtute, sea ad quando libris tractatos. Vim mucius percipit laboramus ad, ex vitae urbanitas vel, dicat inani suscipiantur at vix.</p> */}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <div className="login-form">
                                    <form onSubmit={this.handleFormSubmit}>
                                        <h1 className="text-center w-100 font-700">LOGIN</h1>
                                        <p className="text-center w-100 mb-3">Silahkan masuk untuk mengikuti polling.</p>
                                        <div className="input-container">
                                            <i className="fa fa-user icon"></i>
                                            <input onChange={this.handleChange} className="input-field" type="text" placeholder="Username" name="username" />
                                        </div>
                                        
                                        <div className="input-container">
                                            <i className="fa fa-key icon"></i>
                                            <input onChange={this.handleChange} className="input-field" type="password" placeholder="Password" name="password" />
                                        </div>
                                        
                                        <div className="text-lupa-password"><a href="./">Lupa password?</a></div>
                                        <button type="submit" className="btn btn-lg btn-danger">
                                            {this.state.loading && (<i className="fas fa-spinner fa-spin mr-2" />)} Login
                                        </button>
                                        <div className="text-daftar">Belum memiliki akun? 
                                            <strong>
                                                <NavLink to="/daftar" className="ml-1">
                                                <i className="fas fa-sign-in-alt ml-1 mr-1"></i> Daftar
                                                </NavLink>
                                            </strong>
                                        </div>
                                        <FacebookLogin
                                        appId="657632311297060"
                                        autoLoad={false}
                                        fields="id,name,first_name,last_name,email,picture"
                                        scope="public_profile, email"
                                        callback={responseFacebook}
                                        cssClass="btn btn-lg btn-facebook" 
                                        icon="fa-facebook" />
                                        

                                        <GoogleLogin
                                        clientId="554883845490-vvfg8kbm9jd4i835g457977gpcv00jpk.apps.googleusercontent.com"
                                        buttonText="Login with Google"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle} 
                                        className="btn-google btn btn-lg btn-danger">
                                            {this.state.loadingGoogle && (<i className="fas fa-spinner fa-spin mr-2" />)} <i className="fab fa-google mr-2"></i>  Login with Google
                                        </GoogleLogin>
                                        
                                        {/* <button href="#" className="btn btn-lg btn-facebook"><i className="fab fa-facebook-f mr-2"></i> Facebook</button>
                                        <button href="#" className="btn btn-lg btn-danger"><i className="fab fa-google mr-2"></i> Google</button> */}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Login;