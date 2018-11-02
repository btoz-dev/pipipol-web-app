import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import {PostData} from '../services/PostData';
import md5 from "md5";

const BaseURL = "http://pipipol.btoz.co.id";

class Login extends Component {

    constructor(){
        super();
       
        this.state = {
            username: '',
            password: '',
            redirectToReferrer: false
        };

        this.login = this.login.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    login() {
        console.log(this.state.username)
        console.log(this.state.password)

        const encodedDataUser = Object.keys(this.state).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(this.state[key]);
            }).join('&');

        if(this.state.username && this.state.password){
            PostData('userLogin',encodedDataUser).then((result) => {
                let responseJson = result;
                if(responseJson){         
                    sessionStorage.setItem('userData',JSON.stringify(responseJson));
                    this.setState({redirectToReferrer: true});
                    console.log(sessionStorage.userData)
                }
                else{
                    console.log("login error")
                }
            });
        }
    }
    
    onChangeUsername(e){
        this.setState({
            username: e.target.value,
        });
    }
    onChangePassword(e){
        this.setState({
            password: md5(e.target.value)
        });
    }

    render() {

        if (this.state.redirectToReferrer) {
            return (<Redirect to={'/'}/>)
        }
         
        if(sessionStorage.getItem('encodedDataUser')){
            return (<Redirect to={'/'}/>)
        }

        return (
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
                            <div className="col-sm-12 col-md-12 col-lg-7 my-auto">
                                <div className="login-copy text-center">
                                    <div className="mb-3"><a href="#"><img src="https://uploads.codesandbox.io/uploads/user/8a33cde4-3c2b-460f-8e6a-0515dce90c12/DDRA-logo-pipipol.png" /></a></div>
                                    <p>Lorem ipsum dolor sit amet, quaestio philosophia eu quo, eum movet delectus deterruisset no. Soluta civibus patrioque et nec. Qui alii doming postulant ex. Fuisset honestatis ut eam, illud voluptatum per et. Ut sit iusto virtute, sea ad quando libris tractatos. Vim mucius percipit laboramus ad, ex vitae urbanitas vel, dicat inani suscipiantur at vix.</p>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-5">
                                <div className="login-form">

                                        <h2 className="text-center w-100">Login</h2>
                                        <div className="input-container">
                                            <i className="fa fa-user icon"></i>
                                            <input onChange={this.onChangeUsername} className="input-field" type="text" placeholder="Username" name="username" />
                                        </div>
                                        
                                        <div className="input-container">
                                            <i className="fa fa-key icon"></i>
                                            <input onChange={this.onChangePassword} className="input-field" type="password" placeholder="Password" name="password" />
                                        </div>
                                        
                                        <div className="text-lupa-password"><a href="#">Lupa password?</a></div>
                                        <button onClick={this.login} type="submit" className="btn btn-lg btn-danger">Login</button>
                                        <div className="text-daftar">Belum memiliki akun? 
                                            <strong>
                                                <NavLink to="/daftar">
                                                    Daftar
                                                </NavLink>
                                            </strong>
                                        </div>
                                        <a href="#" className="btn btn-lg btn-facebook"><i className="fab fa-facebook-f mr-2"></i> Facebook</a>
                                        <a href="#" className="btn btn-lg btn-danger"><i className="fab fa-google mr-2"></i> Google</a>

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