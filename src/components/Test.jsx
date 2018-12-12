import React, { Component } from "react";
import axios from "axios";
import md5 from "md5";
import Search from "./Search";

const qs = require('query-string');

const BaseURL = `https://api.pipipol.com/api`;

class Test extends Component {

    constructor(props){
        super(props);
       
        this.state = {
            AUTH_TOKEN: localStorage.getItem("id_token"),
            userDetails: JSON.parse(localStorage.getItem("userDetails")),

            file: '',
            imagePreviewUrl: ''
        };
        this.submitTestRedeem = this.submitTestRedeem.bind(this);
        this.submitTestChangePassword = this.submitTestChangePassword.bind(this);
        this.hitung = this.hitung.bind(this);
        this.testGet = this.testGet.bind(this);
    }

    encodedData = (data) => {
        return Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
    }

    testGet (){
        axios
        .get(`/api/redeemHistory`)
        .then(res => {
            console.log("TEST : redeemHistory")
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
        });
    }

    submitTestDaftar() {        
        let dataForSubmit = { 
            username: 'tester33a', 
            email: 'tester33@testing.com',
            password: '5a81d5f44d635b58ca6803ccd3082c47'
        }

        console.log("=== DATA YANG DISUBMIT ===")
        console.log(this.state.AUTH_TOKEN)

        axios
        .post(BaseURL+`/register`, dataForSubmit,{
            headers: {
              'x-access-token': this.state.AUTH_TOKEN,
              'Access-Control-Allow-Origin': '*',
              'origin': 'x-requested-with',
              'Access-Control-Allow-Headers': 'X-Requested-With',
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Accept':'application/json; charset=utf-8'
            },
            body: dataForSubmit
        })
        .then(res => {
            console.log("=== RESPONSE ===")
            console.log(res);
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    submitTestRedeem() {
        console.log(this.state.userDetails)
        
        let dataForSubmit = { 
            username: this.state.userDetails.username, 
            idVoucher: 16
        }

        console.log("=== DATA YANG DISUBMIT ===")
        console.log(dataForSubmit)

        axios
        .post(BaseURL+`/redeem`, dataForSubmit,{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Cache-Control': 'no-cache',
            'x-access-token': this.state.AUTH_TOKEN
            }
        })
        .then(res => {
            console.log("=== RESPONSE ===")
            console.log(res);
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    submitTestChangePassword() {

        let passwordOld = md5("tester12");
        let passwordNew = md5("tester12new");

        let dataForSubmit = { 'username':'tester12', 'oldPassword': passwordOld, 'newPassword': passwordNew }
        console.log(dataForSubmit)
    
        axios
        .post(BaseURL+`/changePassword`, qs.stringify(dataForSubmit),{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Cache-Control': 'no-cache',
            'x-access-token': this.state.AUTH_TOKEN
            }
        })
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }


    uploadHandler = () => { 
        console.log(this.state.password)
        console.log(this.state.selectedFile)

        this.setState({loadingProfile: true})

        const formData = new FormData()
        formData.append('username', this.state.username)
        formData.append('password', this.state.password)
        formData.append('file', this.state.selectedFile, this.state.selectedFile.name)
        axios.post(BaseURL+`/api/updateAvatar`, formData, {
            onUploadProgress: progressEvent => {
              console.log(progressEvent.loaded / progressEvent.total)
            }
        })
        .then(res => {
            console.log(res);
            console.log(res.data);
            let msg = res.data.message
            console.log(msg)
            this.notify(msg)
            this.setState({loadingProfile: false})
        })
        .catch(err => {
            console.log(err);
            this.notifyError(err)
            this.setState({loadingProfile: false})
        });
    }


    hitung(){
        let pollingPoint = parseInt("10")
        let currentPoint = parseInt("20")
        const totalPoint = parseInt(pollingPoint + currentPoint)
        console.log(totalPoint)

    }

    _handleSubmit = e => {
        e.preventDefault();
        // TODO: do something with -> this.state.file
    }
  
    _handleImageChange = e =>{
        e.preventDefault();
  
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({ file: file, imagePreviewUrl: reader.result });
        }
        reader.readAsDataURL(file)
    }

    render() {

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
  
        return(
            <div>
                

                <Search />

                <form onSubmit={this._handleSubmit}>
                    <input type="file" onChange={this._handleImageChange} />
                    <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
                </form>
                {!$imagePreview && <img src={imagePreviewUrl} />}

                <button onClick={this.submitTestDaftar} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">submitTestDaftar</button>

                <button onClick={this.testGet} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Test Get API Data</button>
                <button onClick={this.uploadHandler} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Upload Avatar</button>
                <button onClick={this.submitTestRedeem} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Submit Test Redeem</button>
                <button onClick={this.submitTestChangePassword} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Submit Test Change Password</button>
                <button onClick={this.hitung} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Hitung</button>
            </div>
        )
    }
}
export default Test;