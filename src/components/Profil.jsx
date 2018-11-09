import React, { Component } from "react";
import axios from "axios";
import withAuth from '../services/withAuth'; 
import md5 from "md5";
import userProfileImgDefault  from'./../img/ic-user.png';
import bgRedeem  from'./../img/bg-redeem.jpg';
import { ToastContainer, toast } from 'react-toastify';



const qs = require('query-string');

const BaseURL = `https://apipipipol.btoz.co.id`;

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
            loadingProfile: false,
            loadingPassword: false,
            selectedFile: null,
            progressBar: '0%'
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

        this.setState({loadingPassword: true})

        let username = this.state.userDetails.username
        let passwordOld = this.state.passwordOld;
        let passwordNew = this.state.passwordNew;
        let passwordConfirm = this.state.passwordConfirm;

        if(passwordOld !== "" || passwordNew !== "" || passwordConfirm !== "" ){

            if(passwordNew === passwordConfirm){

                let dataForSubmit = { 'username':username, 'oldPassword': passwordOld, 'newPassword': passwordNew }
                console.log(dataForSubmit)
            
                axios
                .post(`/api/changePassword`, qs.stringify(dataForSubmit),{
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
                    this.notify(msg)  
                    this.setState({loadingPassword: false})    
                })
                .catch(err => {
                    console.log(err);
                    this.notifyError(err)
                    this.setState({loadingPassword: false})  
                });
            }else{
                this.notifyError("Konfirmasi Password Baru tidak sama")
                this.setState({loadingPassword: false})  
            }
        }else{
            this.notifyError("Semua input wajib diisi!")
            this.setState({loadingPassword: false})  
        }
    }

    // 18. /api/updateProfile           
    // => POST, idUsers, md5(password), address, phone, firstname, lastname, email
    // add headers variable => x-access-token isinya token yg didapat ketika login

    updateProfile() {

        this.setState({loadingProfile: true})

        let userid = this.state.userid;
        let password = this.state.password;
        let phone = this.state.phone;
        let firstname = this.state.firstname;
        let lastname = this.state.lastname;
        let email = this.state.email;

        if(firstname !== "" || email !== "" || phone !== "" || password !== ""){

            let dataForSubmit = { 
                // 'idUsers':userid, 
                'password': password, 
                'firstname': firstname, 
                'lastname': lastname, 
                'email': email,
                'phone': phone
            }
            console.log(dataForSubmit)
        
            axios
            .post(`/api/updateProfile`, qs.stringify(dataForSubmit))
            .then(res => {
                console.log(res);
                console.log(res.data);
                let msg = res.data.message
                console.log(msg)
                this.notify(msg)
                this.setState({loadingProfile: false})
                this.getUserDetails()
            })
            .catch(err => {
                console.log(err);
                this.notifyError(err)
                this.setState({loadingProfile: false})
            });
        }else{
            this.notifyError("Semua input wajib diisi!")
            this.setState({loadingProfile: false})
        }
    }

    fileChangedHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]})
    }

    changeAvatar = () => { 
        this.setState({loadingProfile: true})

        const formData = new FormData()
        formData.append('password', this.state.password)
        formData.append('file', this.state.selectedFile, this.state.selectedFile.name)
        axios
        .post(`/api/updateAvatar`, formData, {
            onUploadProgress: progressEvent => {
                this.setState({
                    progressBar: (Math.round(progressEvent.loaded / progressEvent.total * 100) + "%")
                })
              console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + "%")
            }
        })
        .then(res => {
            console.log(res);
            console.log(res.data);
            let msg = res.data.message
            console.log(msg)
            this.notify(msg)
            this.setState({loadingProfile: false})
            this.getUserDetails()
        })
        .catch(err => {
            console.log(err);
            this.notifyError(err)
            this.setState({loadingProfile: false})
        });
    }

    getUserDetails(){
        console.log("GET USER DETAIL")
        axios
        .get(`/api/getUserDetails/`+this.state.userid)
        .then(res => {
            const userDetails = JSON.stringify(res.data.user_details[0])
            const currentPoint = JSON.stringify(res.data.user_details[0].point)
            console.log("USER DETAILS SEHABIS UPDATE PROFILE:")
            console.log(userDetails)
            localStorage.setItem('userDetails', userDetails)
            localStorage.setItem('currentPoint', currentPoint)

            // KIRIM STATES KE TOP MOST PARENT PARAMNYA: (isLoggedIn, userDetails, currentPoint)
            window.updateTopMostParent("true", userDetails, currentPoint); 

            this.setState({
                loading: false,
                userDetails: JSON.parse(localStorage.getItem("userDetails"))                
            })
        })
    }
     
    notify = (msg) => {
        toast(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };
    notifyError = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: 'pipipol-notify',
            autoClose: 7000
        });
    };

    render() {

        const userDetails = this.state.userDetails
        const userAvatar = userDetails.avatar
        const userBadge = userDetails.badge_img
        const username = userDetails.username
        // console.log("PROFIL - USERDETAILS LOCALSTORAGE")
        // console.log(userDetails)

        return (
            <div
                className="site-content profil container-fluid"
                style={{
                backgroundImage:
                    "url("+bgRedeem+")"
                }}
            >
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
                                                { !userAvatar ? <img className="img-fluid" src={userProfileImgDefault} alt={username} /> : "" }
                                                <button style={{display: "none"}} onClick={() => this.fileInput.click()} className="btn-change-avatar">Ubah Foto</button>
                                                <div style={{display: "none"}} className="progress">
                                                    <div style={{width: this.state.progressBar}} className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">{this.state.progressBar}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <input style={{display: "none"}} type="file" onChange={this.fileChangedHandler} ref={fileInput => this.fileInput = fileInput} />
                                                <button style={{display: "none"}} onClick={this.changeAvatar}>Upload!</button>
                                            </div>
                                            <div className="user-badge text-center">
                                                {!userBadge ? <i className="ic fas fa-award" /> : <img src={ BaseURL+userBadge } alt="" />}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-5 mb-5">
                                            <div className="input-container">
                                                <i className="fa fa-user icon"></i>
                                                <input disabled defaultValue={userDetails.username} onChange={this.onChange} className="input-field" type="text" placeholder="Username" name="username" />
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

                                            <button onClick={this.updateProfile} type="submit" className="btn btn-lg btn-danger w-auto ml-0 mr-0 pl-4 pr-4">{this.state.loadingProfile && (<i className="fas fa-spinner fa-spin mr-1" />)} Update Profil</button>
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
                                            <button onClick={this.changePassword} type="submit" className="btn btn-lg btn-dark w-auto ml-0 mr-0 pl-4 pr-4">{this.state.loadingPassword && (<i className="fas fa-spinner fa-spin mr-1" />)} Ubah Password</button>
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