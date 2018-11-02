import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Header from "../components/Header"
import axios from "axios";
import AuthService from '../services/AuthService';
import md5 from "md5";

const BaseURL = "http://pipipol.btoz.co.id";

class Login extends Component {

    constructor(){
        super();
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

        let passwordMD5 = md5(this.state.password);
      
        this.Auth.login(this.state.username, passwordMD5)
            .then((res) => {
                // console.log(res)
                const userid = res.userid
                console.log("ZZZZZZZZZZ")
                console.log(userid)
                // getUserDetails(userid)
                this.props.history.replace('/');
            })
            .catch(err =>{
                alert(err);
            })
    }
    

    getUserDetails(userid){
        axios.get(`/api/getUserDetails/`+userid)
        .then(res => {
            const userDetails = res.data;
            console.log("USER DETAILS:")
            console.log(userDetails)
            localStorage.setItem('userDetails', userDetails)
        })
    }

    render() {

        return (
            <div>
            <Header />
            <div
                className="site-content container-fluid"
                style={{
                backgroundImage:
                    "url(https://uploads.codesandbox.io/uploads/user/8a33cde4-3c2b-460f-8e6a-0515dce90c12/0pF0-bg-redeem.jpg)"
                }}
            >
                <div className="bg-container container-fluid">
                    <section className="login container">
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-6 my-auto">
                                <div className="login-copy text-center">
                                    <div className="mb-3"><a href="#"><img src="https://uploads.codesandbox.io/uploads/user/8a33cde4-3c2b-460f-8e6a-0515dce90c12/DDRA-logo-pipipol.png" /></a></div>
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
                                        <button type="submit" className="btn btn-lg btn-danger">Login</button>
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