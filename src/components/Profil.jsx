import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import {PostData} from '../services/PostData';
import withAuth from '../services/withAuth'; 
import Header from "../components/Header"
import md5 from "md5";

const BaseURL = "http://apipipipol.btoz.co.id";

class Profil extends Component {

    constructor(props){
        super(props);
       
        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            passwordCurrent: '',
            passwordNew: '',
            passwordConfirm: '',
            redirectToReferrer: false
        };
        
    
        this.onChange = this.onChange.bind(this);
        this.onChangePasswordCurrent = this.onChangePasswordCurrent.bind(this);
        this.onChangePasswordNew = this.onChangePasswordNew.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.signup = this.signup.bind(this);
    
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onChangePasswordCurrent(e){
        this.setState({
            password: md5(e.target.value)
        });
    }

    onChangePasswordNew(e){
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
        console.log(this.state.passwordCurrent)
        console.log(this.state.passwordNew)
        console.log(this.state.passwordConfirm)
        console.log(this.state.redirectToReferrer)

        const encodedDataUser = Object.keys(this.state).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(this.state[key]);
            }).join('&');
        
            console.log(encodedDataUser)

        if(this.state.username && 
            this.state.firstname && 
            this.state.email && 
            this.state.phone && 
            this.state.passwordCurrent && 
            this.state.passwordNew && 
            this.state.passwordConfirm){
            PostData('register', encodedDataUser).then((result) => {
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

    render() {

        const localUserDetails = JSON.parse(localStorage.getItem('userDetails'))
        console.log("PROFIL - USERDETAILS LOCALSTORAGE")
        console.log(localUserDetails)

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
                            <div className="col-12">
                                <div className="login-form">
                                    <div className="row">
                                        <h2 className="text-center w-100 mb-5 font-700">PROFILKU</h2>
                                        <div className="col-sm-12 col-md-12 col-lg-3 mb-1">
                                            <div
                                                className="user-avatar"
                                                style={{
                                                backgroundImage: "url("+BaseURL+localUserDetails.avatar+")"
                                                }}
                                            />
                                            <div className="user-name">
                                                <h4>{}</h4>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-5 mb-5">
                                            <div className="input-container">
                                                <i className="fa fa-user icon"></i>
                                                <input defaultValue={localUserDetails.username} onChange={this.onChange} className="input-field" type="text" placeholder="Username" name="username" />
                                            </div>

                                            <div className="input-container">
                                                <div className="form-row">
                                                    <div className="col">
                                                    <i className="fas fa-id-card icon"></i>
                                                        <input defaultValue={localUserDetails.firstname} onChange={this.onChange} className="input-field" type="text" placeholder="Nama Depan" name="firstname" />
                                                    </div>
                                                    <div className="col">
                                                        <input defaultValue={localUserDetails.lastname} onChange={this.onChange} className="input-field pl-3" type="text" placeholder="Nama Belakang" name="lastname" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-envelope icon"></i>
                                                <input defaultValue={localUserDetails.email} onChange={this.onChange} className="input-field" type="email" placeholder="Email" name="email" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-phone icon"></i>
                                                <input defaultValue={localUserDetails.phone} onChange={this.onChange} className="input-field" type="text" placeholder="Nomor Handphone" name="phone" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePasswordCurrent} className="input-field" type="password" placeholder="Password" name="password" />
                                            </div>
                                            
                                            <button onClick={this.signup} type="submit" className="btn btn-lg btn-danger">Update Profil</button>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-4 mb-5">
                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePassword} className="input-field" type="password" placeholder="Password Baru" name="password" />
                                            </div>
                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePasswordConfirm} className="input-field" type="password" placeholder="Konfirmasi Password Baru" name="confirmPassword" />
                                            </div>
                                            <button onClick={this.signup} type="submit" className="btn btn-lg btn-dark">Ganti Password</button>
                                        </div>
                                    </div>   
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )

    }
}

export default withAuth(Profil);