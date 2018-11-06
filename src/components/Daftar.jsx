import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import {PostData} from '../services/PostData';
import Header from "../components/Header"
import md5 from "md5";

class Daftar extends Component {

    constructor(props){
        super(props);
       
        this.state = {
            username: '',
            firstname: '',
            email: '',
            phone: '',
            password: '',
            passwordConfirm: '',
            redirectToReferrer: false,
            login: false
        };
        
    
        this.onChange = this.onChange.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.signup = this.signup.bind(this);
    
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onChangePassword(e){
        this.setState({
            password: md5(e.target.value)
        });
    }

    onChangePasswordConfirm(e){
        this.setState({
            passwordConfirm: md5(e.target.value)
        });
    }
     
    signup() {
        console.log(this.state.username)
        console.log(this.state.firstname)
        console.log(this.state.email)
        console.log(this.state.phone)
        console.log(this.state.password)
        console.log(this.state.redirectToReferrer)

        this.setState({
            loading: true
        })

        const encodedDataUser = Object.keys(this.state).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(this.state[key]);
            }).join('&');
        
            console.log(encodedDataUser)

        if(this.state.username && this.state.firstname && this.state.email && this.state.phone && this.state.password && this.state.passwordConfirm){
            PostData('register', encodedDataUser).then((result) => {
                let responseJson = result;
                if(responseJson){         
                    sessionStorage.setItem('userData',JSON.stringify(responseJson));
                    this.setState({
                        redirectToReferrer: true,
                        loading: true
                    });
                    console.log(sessionStorage.userData)
                    
                }
                else{
                    console.log("login error")
                }
            });
        }
    }

    render() {

        if (this.state.redirectToReferrer || sessionStorage.getItem('userData')) {
            console.log("REDIRECT TRUE")
            return (<Redirect to={'/login'}/>)
        }else{
            console.log("REDIRECT FALSE")
        }

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
                                    
                                        <h1 className="text-center w-100 font-700">DAFTAR</h1>
                                        <div className="input-container">
                                            <i className="fa fa-user icon"></i>
                                            <input onChange={this.onChange} className="input-field" type="text" placeholder="Username" name="username" />
                                        </div>

                                        <div className="input-container">
                                            <i className="fa fa-user icon"></i>
                                            <input onChange={this.onChange} className="input-field" type="text" placeholder="Nama Depan" name="firstname" />
                                        </div>

                                        <div className="input-container">
                                            <i className="fa fa-envelope icon"></i>
                                            <input onChange={this.onChange} className="input-field" type="email" placeholder="Email" name="email" />
                                        </div>

                                        <div className="input-container">
                                            <i className="fa fa-phone icon"></i>
                                            <input onChange={this.onChange} className="input-field" type="text" placeholder="Nomor Handphone" name="phone" />
                                        </div>
                                        
                                        <div className="input-container">
                                            <i className="fa fa-key icon"></i>
                                            <input onChange={this.onChangePassword} className="input-field" type="password" placeholder="Password" name="password" />
                                        </div>

                                        <div className="input-container">
                                            <i className="fa fa-key icon"></i>
                                            <input onChange={this.onChangePasswordConfirm} className="input-field" type="password" placeholder="Confirm Password" name="confirmPassword" />
                                        </div>
                                        
                                        <button onClick={this.signup} type="submit" className="btn btn-lg btn-danger">{this.state.loading && (<i className="fas fa-spinner fa-spin mr-2" />)} Daftar</button>
                                        <div className="text-daftar">Sudah memiliki akun? 
                                            <strong>
                                                <NavLink to="/login" className="ml-1">
                                                <i className="fas fa-lock mr-1" /> Login
                                                </NavLink>
                                            </strong>
                                        </div>
                                
                                    
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

export default Daftar;