import React, { Component } from "react";
import axios from "axios";
import withAuth from '../services/withAuth'; 
import md5 from "md5";
import userProfileImgDefault  from'./../img/ic-user.png';
import bgRedeem  from'./../img/bg-redeem.jpg';
import { ToastContainer, toast } from 'react-toastify';

var scrollToElement = require('scroll-to-element');

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
            progressBar: '0%',
            file: '',
            imagePreviewUrl: ''
        };
        this.onChange = this.onChange.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordOld = this.onChangePasswordOld.bind(this);
        this.onChangePasswordNew = this.onChangePasswordNew.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }

    componentDidMount = async () => {
        scrollToElement('#topPage', {
            offset: -88,
            ease: 'inOutQuad',
            duration: 700
        });
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

        let phone = this.state.phone;
        let firstname = this.state.firstname;
        let lastname = this.state.lastname;
        let email = this.state.email;

        let dataForSubmit = { 
            // 'idUsers':userid, 
            'firstname': firstname, 
            'lastname': lastname, 
            'email': email,
            'phone': phone
        }
        console.log(dataForSubmit)
    
        axios
        .post(`/api/updateProfile`, qs.stringify(dataForSubmit), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Cache-Control': 'no-cache',
              'x-access-token': this.state.AUTH_TOKEN,
            },
            credentials: 'include',
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

    // fileChangedHandler = (event) => {
    //     console.log("INPUT FILE AKTIF")
    //     this.setState({selectedFile: event.target.files[0]})
    //     if(this.state.selectedFile){
    //         this.fileInputBtn.click()
    //         // this.changeAvatar()
    //     }
    // }

    // changeAvatar = () => { 
    //     this.setState({loadingProfile: true})

    //     const formData = new FormData()
    //     formData.append('file', this.state.selectedFile, this.state.selectedFile.name)
    //     axios
    //     .post(`/api/updateAvatar`, formData, {
    //         onUploadProgress: progressEvent => {
    //             this.setState({
    //                 progressBar: (Math.round(progressEvent.loaded / progressEvent.total * 100) + "%")
    //             })
    //           console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + "%")
    //         }
    //     })
    //     .then(res => {
    //         console.log(res);
    //         console.log(res.data);
    //         let msg = res.data.message
    //         console.log(msg)
    //         this.notify(msg)
    //         this.setState({loadingProfile: false})
    //         this.getUserDetails()
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         this.notifyError(err)
    //         this.setState({loadingProfile: false})
    //     });
    // }

    getUserDetails(){
        console.log("GET USER DETAIL")
        axios
        .get(`/api/getUserDetails/`+this.state.userid)
        .then(res => {
            const userDetails = JSON.stringify(res.data.user_details[0])
            const currentPoint = JSON.stringify(res.data.user_details[0].point)
            console.log("USER DETAILS SEHABIS UPDATE PROFILE:")
            console.log(currentPoint)
            localStorage.setItem('userDetails', userDetails)
            localStorage.setItem('currentPoint', currentPoint)

            // KIRIM STATES KE TOP MOST PARENT PARAMNYA: (isLoggedIn, userDetails, currentPoint)
            window.updateTopMostParent(true, userDetails, currentPoint, localStorage.getItem("userAvatar")); 

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

    changeAvatar = e => {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        this.setState({loadingProfile: true})

        const formData = new FormData()
        formData.append('file', this.state.file, this.state.file.name)
        axios
        .post(`/api/updateAvatar`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Cache-Control': 'no-cache',
                'x-access-token': this.state.AUTH_TOKEN,
            },
            credentials: 'include',
            
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
            this.setState({imagePreviewUrl: null})
            // this.getUserDetails()
        })
        .catch(err => {
            console.log(err);
            this.notifyError(err)
            this.setState({loadingProfile: false})
        });
    }
  
    fileChangedHandler = e =>{
        e.preventDefault();
  
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({ file: file, imagePreviewUrl: reader.result });
            window.updateTopMostParent(true, JSON.parse(localStorage.getItem('userDetails')), localStorage.getItem("currentPoint"), localStorage.getItem("userAvatar")); 

        }
        reader.readAsDataURL(file)

        // KIRIM STATES KE TOP MOST PARENT PARAMNYA: (isLoggedIn, userDetails, currentPoint)
    }

    render() {

        const userDetails = this.state.userDetails
        const userAvatar = userDetails.avatar
        const userBadge = userDetails.badge_img
        const username = userDetails.username
        // console.log("PROFIL - USERDETAILS LOCALSTORAGE")
        // console.log(userDetails)

        let {imagePreviewUrl} = this.state;
        let $userAvatarUrl = null;

        if (imagePreviewUrl) {
            $userAvatarUrl = imagePreviewUrl;
            localStorage.setItem("userAvatar", imagePreviewUrl)
        }else{
            if(localStorage.getItem("userAvatar")){
                $userAvatarUrl = localStorage.getItem("userAvatar");
            }else{
                $userAvatarUrl = BaseURL+userAvatar;
            }
        }
        
        let $avatarLoader = (<div><i className="fas fa-circle-notch fa-spin"></i><span className="progress-upload">{this.state.progressBar}</span></div>);
        let $avatarUploadBtn = (<button className="btn-upload-avatar btn btn-dark btn-sm" onClick={this.changeAvatar} ref={fileInputBtn => this.fileInputBtn = fileInputBtn}><i class="fas fa-upload mr-1"></i> Upload</button>)
        return (
            <div
                className="site-content profil container-fluid"
                style={{
                backgroundImage:
                    "url("+bgRedeem+")"
                }}
            >
                <ToastContainer />
                
                {/* <form onSubmit={this._handleSubmit}>
                    <input type="file" onChange={this._handleImageChange} />
                    <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
                </form>
                {!$imagePreview && <img src={imagePreviewUrl} />} */}

                

                <div id="topPage" className="bg-container container-fluid pb-3">
                    <section className="login container">
                        <div className="row">
                            <div className="col-12">
                                <div className="login-form">
                                    <div className="row">
                                        <h2 className="text-center w-100 mb-5 font-700">PROFILKU</h2>
                                        <div className="col-sm-12 col-md-12 col-lg-3 mb-5">
                                            
                                            <div className="user-avatar" style={{backgroundImage: "url("+$userAvatarUrl+")"}}>

                                                { $userAvatarUrl === '"https://apipipipol.btoz.co.idnull"' ? <img className="img-fluid user-avatar-default" src={userProfileImgDefault} alt={username} /> : "" }

                                                <button onClick={() => this.fileInput.click()} className={this.state.loadingProfile ? "btn-change-avatar anim show" : "btn-change-avatar anim" }>
                                                    {this.state.loadingProfile ? $avatarLoader : <i className="fas fa-camera"></i> }
                                                </button>

                                                <input style={{display: "none"}} type="file" onChange={this.fileChangedHandler} ref={fileInput => this.fileInput = fileInput} />
                                            
                                            </div>
                                            
                                            {this.state.imagePreviewUrl && ($avatarUploadBtn)}

                                            <div className="text-center mb-4"><strong>{userDetails.username}</strong></div>

                                            <div className="user-badge text-center">
                                                {!userBadge ? <i className="ic fas fa-award" /> : <img src={ BaseURL+userBadge } alt="" />}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-5 mb-5">
                                            {/* <div className="input-container">
                                                <i className="fa fa-user icon"></i>
                                                <input disabled defaultValue={userDetails.username} onChange={this.onChange} className="input-field" type="text" placeholder="Username" name="username" />
                                            </div> */}

                                            {/* <div className="input-container">
                                                <div className="form-row">
                                                    <div className="col">
                                                    <i className="fas fa-id-card icon"></i>
                                                        <input defaultValue={userDetails.firstname} onChange={this.onChange} className="input-field" type="text" placeholder="Nama Depan" name="firstname" />
                                                    </div>
                                                    <div className="col">
                                                        <input defaultValue={userDetails.lastname} onChange={this.onChange} className="input-field pl-3" type="text" placeholder="Nama Belakang" name="lastname" />
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="input-container">
                                                <i className="fas fa-id-card icon"></i>
                                                <input defaultValue={userDetails.firstname} onChange={this.onChange} className="input-field" type="text" placeholder="Nama Depan" name="firstname" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fas fa-id-card icon"></i>
                                                <input defaultValue={userDetails.lastname} onChange={this.onChange} className="input-field" type="text" placeholder="Nama Belakang" name="lastname" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-envelope icon"></i>
                                                <input defaultValue={userDetails.email} onChange={this.onChange} className="input-field" type="email" placeholder="Email" name="email" />
                                            </div>

                                            <div className="input-container">
                                                <i className="fa fa-phone icon"></i>
                                                <input defaultValue={userDetails.phone} onChange={this.onChange} className="input-field" type="text" placeholder="Nomor Handphone" name="phone" />
                                            </div>

                                            {/* <div className="input-container">
                                                <i className="fa fa-key icon"></i>
                                                <input onChange={this.onChangePassword} className="input-field" type="password" placeholder="Password" name="password" required />
                                            </div> */}

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