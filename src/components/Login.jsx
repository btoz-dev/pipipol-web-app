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

const qs = require('query-string');

const BaseURL = "https://apipipipol.btoz.co.id";

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            loginMessage: "",
            loading: false,
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
        if (type === 'facebook' && res.email) {

            this.setState({ loadingFacebook: true })

            postData = {
                name: res.name,
                provider: type,
                email: res.email,
                provider_id: res.id,
                token: res.accessToken,
                provider_pic: res.picture.data.url
            };
            if (postData) {
                PostData('facebookAuth', postData).then((result) => {
                   let responseJson = result;
                   sessionStorage.setItem("userData", JSON.stringify(responseJson));
                   this.setState({redirect: true});
                });
            }
        }

        // GOOGLE
        if (type === 'google' && res.w3.U3) {

            this.setState({ loadingGoogle: true })

            postData = {
                idtoken: res.Zi.id_token
            };
            
            if (postData) {

                localStorage.setItem("id_token", postData.idtoken);

                PostData('googleAuth', this.encodedData(postData))
                .then((result) => {
                    this.setState({ loadingGoogle: false })
                    let response = result;
                    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
                        sessionStorage.setItem("userData", JSON.stringify(response));
                        this.setState({redirect: true});
                    } else {
                        this.notifyErrorAPI("ERROR "+" "+ response.status +" "+ response.statusText)
                        //  JIKA GAGAL REMOVE
                        localStorage.removeItem('id_token');
                        localStorage.removeItem('userData');
                    }
                });
            }
            
            // if (postData) {
            //     localStorage.setItem("id_token", postData.idtoken);
            //     PostData('googleAuth', postData).then((result) => {
            //         console.log("RESULT => api/googleAuth") 
            //         console.log(result)  
            //         let responseJson = result;
            //         if(responseJson){  
            //             sessionStorage.setItem("userData", JSON.stringify(responseJson));
            //             this.setState({redirect: true});
            //             // return (<Redirect to={'/login'}/>)
            //         }
            //         else{
            //             console.log("DAFTAR ERROR")
            //             this.setState({loading: false})
            //             this.notifyError("Terjadi kesalahan, silahkan mengulangi lagi.")
            //         }
            //     });
            // }

            // USING AXIOS
            // localStorage.setItem("id_token", res.Zi.id_token);
            // let dataForSubmit = { 
            //     'idtoken': res.Zi.id_token
            // }
            // console.log(dataForSubmit)
        
            // axios
            // .post(`/api/googleAuth`, this.encodedData(dataForSubmit))
            // .then(res => {
            //     console.log(res);
            //     console.log(res.data);
            //     console.log(res.data.message)
            // })
            // .catch(err => {
            //     console.log(err);
            // });
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
    

    getUserDetails(userid){
        axios.get(`/api/getUserDetails/`+userid)
        .then(res => {
            const userDetails = JSON.stringify(res.data.user_details[0])
            const currentPoint = JSON.stringify(res.data.user_details[0].point)
            const userAvatarUrl = JSON.stringify(BaseURL+res.data.user_details[0].avatar)
            console.log("USER DETAILS DAPAT PAS LOGIN:")
            console.log(userDetails)
            localStorage.setItem('userDetails', userDetails)
            localStorage.setItem('currentPoint', currentPoint)
            localStorage.setItem('userAvatar', userAvatarUrl)

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
                                        appId="417821488749878"
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        callback={responseFacebook}
                                        cssClass="btn btn-lg btn-facebook" 
                                        icon="fa-facebook" />
                                        

                                        <GoogleLogin
                                        clientId="406655711555-59vmbcsf2a7e39ikv7p6ktaqfb5obkn6.apps.googleusercontent.com"
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