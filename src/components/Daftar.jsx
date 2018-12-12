import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import {PostData} from '../services/PostData';
import md5 from "md5";
import { ToastContainer, toast } from 'react-toastify';
import SimpleReactValidator from 'simple-react-validator';
import bgRedeem  from'./../img/bg-redeem.jpg';
import logoPipipol  from'./../img/logo-pipipol.png';

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
            login: false,
            notifMsg: '',
            loading: false
        };
        
    
        // this.onChange = this.onChange.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.signup = this.signup.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        // this.onBlurEmail = this.onBlurEmail.bind(this);
        this.validator = new SimpleReactValidator();
        this.validatorUsername = new SimpleReactValidator();
        this.validatorEmail = new SimpleReactValidator();
        this.validatorPassword = new SimpleReactValidator();
        this.validatorPasswordConfirm = new SimpleReactValidator();
    }


    encodedData(data) {
        return Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
    }

    // onChange(e){
    //     this.setState({
    //         [e.target.name]: e.target.value
    //     });
    // }
    // onBlurEmail(e){
    //     if( !this.validator.fieldValid('email') ){
    //         this.validator.showMessages();
    //     }
    // }

    onChangeUsername(e){
        this.setState({
            username: e.target.value
        }, () => {
            if( !this.validatorUsername.fieldValid('username') ){
                this.validatorUsername.showMessages();
            }
        });
    }
    onChangeEmail(e){
        this.setState({
            email: e.target.value
        }, () => {
            if( !this.validatorEmail.fieldValid('email') ){
                this.validatorEmail.showMessages();
            }
        });
    }
    onChangePassword(e){
        this.setState({
            password: e.target.value
        }, () => {
            if( !this.validatorPassword.fieldValid('password') ){
                this.validatorPassword.showMessages();
                console.log("NOT VALID")
            }else{
                console.log("VALID")
            }
        });
    }
    onChangePasswordConfirm(e){
        this.setState({
            passwordConfirm: e.target.value
        }, () => {
            if( !this.validatorPasswordConfirm.fieldValid('password') ){
                this.validatorPasswordConfirm.showMessages();
            }
        });
    }

    // onChangePassword(e){
    //     this.setState({
    //         password: md5(e.target.value)
    //     });
    // }

    // onChangePasswordConfirm(e){
    //     this.setState({
    //         passwordConfirm: md5(e.target.value)
    //     });
    // }
     
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

        let postData = {
                username: this.state.username,
                email: this.state.email,
                password: md5(this.state.password)
            }

        if(this.state.username && this.state.email && this.state.password && this.state.passwordConfirm){
            
            if(this.state.password === this.state.passwordConfirm){

                fetch(`https://api.pipipol.com/api/register`, {
                    method: 'POST',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'origin': 'x-requested-with',
                      'Access-Control-Allow-Headers': 'X-Requested-With',
                      'X-Requested-With': 'XMLHttpRequest',
                      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                      'Accept':'application/json; charset=utf-8'
                    },
                    body: this.encodedData(postData)
                })
                .then((response) => {
                    return response.json()
                    console.log("response.json() =>", response);
                })
                .then((body) => {
                    
                    let registerMessage = body.message

                    if(body.register){  
                        console.log("DAFTAR SUKSES")  
                        this.setState({
                            redirectToReferrer: true,
                            loading: false
                        });
                        // return (<Redirect to={'/login'}/>)
                    }else{
                        console.log("DAFTAR FAILED")
                        this.setState({loading: false})
                        this.notifyError(registerMessage)
                    }
                })
                .catch((error) => {
                    localStorage.removeItem('id_token');
                    sessionStorage.removeItem('userData');
                    console.log("=== RESPONSE ERROR DARI POSTDATA ===")
                    console.log(error)
                    this.notifyError(error)
                });
                
            }else{
                console.log("PASSWORD BEDA!!!!")
                this.notifyError("Password tidak cocok, silahkan periksa kembali.")
                this.setState({loading: false})
            }
        }else{
            console.log("ELSE DAFTAR ERROR")
            this.setState({loading: false,})
            this.notifyError("Semua fields wajib di isi.")
        }
    }

    notify = () => {
        toast(this.state.notifMsg, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };
    notifyError = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 15000
        });
    };

    render() {

        if (this.state.redirectToReferrer || sessionStorage.getItem('userData')) {
            console.log("REDIRECT TRUE")
            return (<Redirect to={'/login'}/>)
        }else{
            console.log("REDIRECT FALSE")
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
                                    
                                        <h1 className="text-center w-100 font-700">DAFTAR</h1>
                                        <div className="input-container">
                                            <i className="fa fa-user icon"></i>
                                            <input onChange={this.onChangeUsername} className="input-field" type="text" placeholder="Username" name="username" required />
                                        </div>
                                        {this.validatorUsername.message('username', this.state.username, 'required|alpha_num_dash', 'validation-input-message text-danger small font-italic')}

                                        {/* <div className="input-container">
                                            <i className="fa fa-user icon"></i>
                                            <input onChange={this.onChange} className="input-field" type="text" placeholder="Nama Depan" name="firstname" />
                                        </div> */}

                                        <div className="input-container">
                                            <i className="fa fa-envelope icon"></i>
                                            <input onChange={this.onChangeEmail} className="input-field" type="email" placeholder="Email" name="email" required />
                                        </div>
                                        {this.validatorEmail.message('email', this.state.email, 'required|email', 'validation-input-message text-danger small font-italic')}

                                        {/* <div className="input-container">
                                            <i className="fa fa-phone icon"></i>
                                            <input onChange={this.onChange} className="input-field" type="text" placeholder="Nomor Handphone" name="phone" />
                                        </div> */}
                                        
                                        <div className="input-container">
                                            <i className="fa fa-key icon"></i>
                                            <input onChange={this.onChangePassword} className="input-field" type="password" placeholder="Password" name="password" required />
                                        </div>
                                        {this.validatorPassword.message('password', this.state.password, 'required|min:7', 'validation-input-message text-danger small font-italic')}

                                        <div className="input-container">
                                            <i className="fa fa-key icon"></i>
                                            <input onChange={this.onChangePasswordConfirm} className="input-field" type="password" placeholder="Confirm Password" name="confirmPassword" required />
                                        </div>
                                        {this.validatorPasswordConfirm.message('password', this.state.passwordConfirm, 'required|min:7', 'validation-input-message text-danger small font-italic')}
                                        
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
        )

    }
}

export default Daftar;