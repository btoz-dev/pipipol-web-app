import React, { Component } from "react";
import {PostData} from '../services/PostData';
import axios from "axios";
import md5 from "md5";

const BaseURL = `http://apipipipol.btoz.co.id/api`;

class Test extends Component {

    constructor(props){
        super(props);
       
        this.state = {
            AUTH_TOKEN: localStorage.getItem("id_token"),
            userDetails: JSON.parse(localStorage.getItem("userDetails"))
        };
        this.submitTestRedeem = this.submitTestRedeem.bind(this);
        this.submitTestChangePassword = this.submitTestChangePassword.bind(this);
        this.hitung = this.hitung.bind(this);
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
        .post(BaseURL+`/changePassword`, dataForSubmit,{
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


    hitung(){
        let pollingPoint = parseInt("10")
        let currentPoint = parseInt("20")
        const totalPoint = parseInt(pollingPoint + currentPoint)
        console.log(totalPoint)

    }

    render() {
        return(
            <div>
                <button onClick={this.submitTestRedeem} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Submit Test Redeem</button>
                <button onClick={this.submitTestChangePassword} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Submit Test Change Password</button>
                <button onClick={this.hitung} type="submit" className="btn btn-lg btn-danger w-100 mt-3 mb-3">Hitung</button>
            </div>
        )
    }
}
export default Test;