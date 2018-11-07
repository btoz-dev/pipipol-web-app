import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import AuthService from '../services/AuthService';
import md5 from "md5";
import { ToastContainer, toast } from 'react-toastify';
import bgRedeem  from'./../img/bg-redeem.jpg';
import logoPipipol  from'./../img/logo-pipipol.png';

const BaseURL = "https://apipipipol.btoz.co.id";

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            loginMessage: "",
            loading: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
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
            console.log("USER DETAILS DAPAT PAS LOGIN:")
            console.log(userDetails)
            localStorage.setItem('userDetails', userDetails)
            localStorage.setItem('currentPoint', currentPoint)

            // KIRIM STATES KE TOP MOST PARENT PARAMNYA: (isLoggedIn, userDetails, currentPoint)
            window.updateTopMostParent("true", userDetails, currentPoint); 

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

    render() {

        return (
            <div>
                {/* NOTIFY */}
                <ToastContainer />
            <div
                className="site-content container-fluid"
                style={{
                backgroundImage:
                    "url("+bgRedeem+")"
                }}
            >
                <div className="bg-container container-fluid">
                    <section className="login container">
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-6 my-auto">
                                <div className="login-copy text-center">
                                    <div className="mb-3"><a href="#"><img src={logoPipipol} /></a></div>
                                    <p>Lorem ipsum dolor sit amet, quaestio philosophia eu quo, eum movet delectus deterruisset no. Soluta civibus patrioque et nec. Qui alii doming postulant ex. Fuisset honestatis ut eam, illud voluptatum per et. Ut sit iusto virtute, sea ad quando libris tractatos. Vim mucius percipit laboramus ad, ex vitae urbanitas vel, dicat inani suscipiantur at vix.</p>
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
                                        
                                        <div className="text-lupa-password"><a href="#">Lupa password?</a></div>
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
                                        <a href="#" className="btn btn-lg btn-facebook"><i className="fab fa-facebook-f mr-2"></i> Facebook</a>
                                        <a href="#" className="btn btn-lg btn-danger"><i className="fab fa-google mr-2"></i> Google</a>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            </div>
        )
    }
}

export default Login;