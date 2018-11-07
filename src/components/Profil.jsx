import React, { Component } from "react";
import axios from "axios";
import withAuth from '../services/withAuth'; 
import md5 from "md5";
import userProfileImgDefault  from'./../img/ic-user.png';
import bgRedeem  from'./../img/bg-redeem.jpg';
import { ToastContainer, toast } from 'react-toastify';



const qs = require('query-string');

const BaseURL = `https://cors-anywhere.herokuapp.com/https://apipipipol.btoz.co.id`;

class Profil extends Component {

    constructor(props){
        super(props);
       
        this.state = {
            AUTH_TOKEN: localStorage.getItem("id_token"),
            userDetails: JSON.parse(localStorage.getItem("userDetails")),
            userid: localStorage.getItem("userid"),
            username: '', // BIKIN DEFAULT DARI INPUT YG TERISI SAAT INI
            firstname: '', // BIKIN DEFAULT DARI INPUT YG TERISI SAAT INI
            lastname: '', // BIKIN DEFAULT DARI INPUT YG TERISI SAAT INI
            email: '', // BIKIN DEFAULT DARI INPUT YG TERISI SAAT INI
            phone: '', // BIKIN DEFAULT DARI INPUT YG TERISI SAAT INI
            password: '',
            passwordOld: '',
            passwordNew: '',
            passwordConfirm: '',
            redirectToReferrer: false,
            notifyMessage: "Input Password tidak boleh kosong!"
        };
        this.onChange = this.onChange.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordOld = this.onChangePasswordOld.bind(this);
        this.onChangePasswordNew = this.onChangePasswordNew.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("USERNAME")
        console.log(this.state.username)
    }

    onChangePassword(e){
        this.setState({
            password: md5(e.target.value)
        });
        console.log(this.state.passwordOld)
    }

    onChangePasswordOld(e){
        this.setState({
            passwordOld: md5(e.target.value)
        });
        console.log(this.state.passwordOld)
    }

    onChangePasswordNew(e){
        this.setState({
            passwordNew: md5(e.target.value)
        });
        console.log(this.state.passwordNew)
    }

    onChangePasswordConfirm(e){
        this.setState({
            passwordConfirm: md5(e.target.value)
        });
        console.log(this.state.passwordConfirm)
    }

    changePassword() {

        let username = this.state.userDetails.username
        let passwordOld = this.state.passwordOld;
        let passwordNew = this.state.passwordNew;
        let passwordConfirm = this.state.passwordConfirm;

        if(passwordOld !== "" || passwordNew !== "" || passwordConfirm !== "" ){

            if(passwordNew === passwordConfirm){

                let dataForSubmit = { 'username':username, 'oldPassword': passwordOld, 'newPassword': passwordNew }
                console.log(dataForSubmit)
            
                axios
                .post(BaseURL+`/api/changePassword`, qs.stringify(dataForSubmit),{
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Cache-Control': 'no-cache',
                    'x-access-token': this.state.AUTH_TOKEN
                    }
                })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    let msg = res.data.message
                    console.log(msg)
                    if(msg === "wrong old password"){
                        this.setState({
                            notifyMessage: "Password lama salah!"
                        })
                        this.notifyError()
                    }else{
                        this.setState({
                            notifyMessage: "Password berhasil dirubah!"
                        })
                        this.notify()
                    }
                    
                })
                .catch(err => {
                    console.log(err);
                });
            }else{
                this.setState({
                    notifyMessage: "Konfirmasi Password Baru tidak sama"
                })
                this.notifyError()
            }
        }else{
            this.setState({
                notifyMessage: "Input Password tidak boleh kosong!"
            })
            this.notifyError()
        }
    }

    // 18. /api/updateProfile           
    // => POST, idUsers, md5(password), address, phone, firstname, lastname, email
    // add headers variable => x-access-token isinya token yg didapat ketika login

    updateProfile() {

        let userid = this.state.userid;
        let password = this.state.password;
        let address = this.state.address;
        let phone = this.state.phone;
        let firstname = this.state.firstname;
        let lastname = this.state.lastname;
        let email = this.state.email;

        if(firstname !== "" || email !== "" || phone !== "" || password !== ""){

            let dataForSubmit = { 
                'idUsers':userid, 
                'password': password, 
                'firstname': firstname, 
                'lastname': lastname, 
                'email': email,
                'phone': phone
            }
            console.log(dataForSubmit)
        
            axios
            .post(BaseURL+`/api/updateProfile`, qs.stringify(dataForSubmit),{
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Cache-Control': 'no-cache',
                'x-access-token': this.state.AUTH_TOKEN
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.data);
                let msg = res.data.message
                console.log(msg)
                this.setState({
                    notifyMessage: msg
                })
                this.notify()
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    notifyMessage: err
                })
                this.notifyError()
            });
        }else{
            this.setState({
                notifyMessage: "Input Password tidak boleh kosong!"
            })
            this.notifyError()
        }
    }
     
    notify = () => {
        toast(this.state.notifyMessage, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };
    notifyError = () => {
        toast.error(this.state.notifyMessage, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };

    render() {

        const userDetails = this.state.userDetails
        const userAvatar = userDetails.avatar
        const userBadge = userDetails.badge_img
        console.log("PROFIL - USERDETAILS LOCALSTORAGE")
        console.log(userDetails)

        return (
            <div
                className="site-content profil container-fluid"
                style={{
                backgroundImage:
                    "url("+bgRedeem+")"
                }}
            >
                {/* NOTIFY */}
                <ToastContainer />

                <div className="bg-container container-fluid">
                    <section className="login container">
                        <div className="row">
                            <div className="col-12">
                                <div className="login-form">
                                    <div className="row">
                                        <h2 className="text-center w-100 mb-5 font-700">PROFILKU</h2>
                                        <div className="col-sm-12 col-md-12 col-lg-3 mb-5">
                                            <div
                                                className="user-avatar"
                                                style={{
                                                backgroundImage: "url("+BaseURL+userAvatar+")"
                                                }}
                                            >
                                                { !userAvatar ? <img className="img-fluid" src={userProfileImgDefault} /> : "" }
                                            </div>
                                            <div className="user-badge text-center">
                                                {!userBadge ? <i className="ic fas fa-award" /> : <img src={ BaseURL+userBadge } />}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-5 mb-5">
                                            <div className="input-container">
                                                <i className="fa fa-user icon"></i>
                                                <input defaultValue={userDetails.username} onChange={this.onChange} className="input-field" type="text" placeholder="Username" name="username" />
                                            </div>

                                            <div className="input-container">
                                                <div className="form-row">
                                                    <div className="col">
                                                    <i className="fas fa-id-card icon"></i>
                                                        <input defaultValue={userDetails.firstname} onChange={this.onChange} className="input-field" type="text" placeholder="Nama Depan" name="firstname" />
                                                    </div>
                                                    <div className="col">
                                                        <input defaultValue={userDetails.lastname} onChange={this.onChange} className="input-field pl-3" type="text" placeholder="Nama Belakang" name="lastname" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-envelope icon"></i>
                                                <input defaultValue={userDetails.email} onChange={this.onChange} className="input-field" type="email" placeholder="Email" name="email" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-phone icon"></i>
                                                <input defaultValue={userDetails.phone} onChange={this.onChange} className="input-field" type="text" placeholder="Nomor Handphone" name="phone" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePassword} className="input-field" type="password" placeholder="Password" name="password" required />
                                            </div>

                                            <button onClick={this.updateProfile} type="submit" className="btn btn-lg btn-danger">Update Profil</button>
                                        </div>

                                        <div className="col-sm-12 col-md-6 col-lg-4 mb-5">
                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePasswordOld} className="input-field" type="password" placeholder="Password Lama" name="password" required />
                                            </div>
                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePasswordNew} className="input-field" type="password" placeholder="Password Baru" name="passwordBaru" required />
                                            </div>
                                            <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePasswordConfirm} className="input-field" type="password" placeholder="Konfirmasi Password Baru" name="confirmPassword" required />
                                            </div>
                                            <button onClick={this.changePassword} type="submit" className="btn btn-lg btn-dark">Ganti Password</button>
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