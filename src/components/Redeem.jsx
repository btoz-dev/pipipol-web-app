import React, { Component } from "react";
import axios from "axios";
import userProfileImgDefault  from'./../img/ic-user.png';
import bgRedeem  from'./../img/bg-redeem.jpg';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

const queryString = require('query-string');

const BaseURL = "https://apipipipol.btoz.co.id";

class Redeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AUTH_TOKEN: localStorage.getItem("id_token"),
      userDetails: JSON.parse(localStorage.getItem("userDetails")),
      redeem: [],
      username: "",
      idVoucher: "",
      nameVoucher: "",
      pointVoucher: "",
      modalTitle: "",
      modalMessage: "",
      loading: true,
      loadingSubmitRedeem: false,
      redeemStatus: false,
      sisaPoint: localStorage.getItem("currentPoint"),
      modalRedeemShow: false,
      redeemMessage: ""
    };
    this.submitRedeem = this.submitRedeem.bind(this);
    this.toggleModalRedeemShow = this.toggleModalRedeemShow.bind(this);
  }
  componentDidMount = async () => {
    axios
    .get(`/api/getVouchers`)
      .then(res => {
        console.log(res.data)
        this.setState({ 
          redeem: res.data.list_vouchers, 
          loading: false 
        });
        console.log("REDEEM - USERDETAILS LOCALSTORAGE")
        console.log(this.state.userDetails)
      }
    )
  };

  getVouchers(){
    axios
      .get(`/api/getVouchers`)
        .then(res => {
          console.log(res.data)
          this.setState({ 
            redeem: res.data.list_vouchers, 
            loading: false 
          });
          console.log("REDEEM - USERDETAILS LOCALSTORAGE")
          console.log(this.state.userDetails)
        }
      )
  }

  submitRedeem(id, name, point) {

    this.setState({
      loadingSubmitRedeem: true
    })


    this.setState({
      idVoucher: id,
      nameVoucher: name,
      pointVoucher: point
    })


    let dataForSubmit = { 
        idUsers: localStorage.getItem("userid"), 
        'idVoucher[]': [id]
    }

    console.log("=== DATA YANG DISUBMIT ===")
    console.log(dataForSubmit)

    let dataForSubmitEncoded = queryString.stringify(dataForSubmit);

    axios
    .post(`/api/redeem`, dataForSubmitEncoded)
    .then(res => {
        console.log("=== RESPONSE ===")
        console.log(res);
        console.log(res.data);
        let msg = res.data.message
        let sisaPoint = res.data.sisa_point
        console.log(msg)
        if(msg === "Point anda tidak cukup" || msg === "System error"){
          this.setState({
            redeemStatus: false,
          });
          this.notifyError(msg)
        }else{
          this.setState({
            redeemStatus: true,
            modalTitle: "Terimakasih, redeem berhasil!",
            sisaPoint: sisaPoint,
            modalRedeemShow: !this.state.modalRedeemShow
          });
          localStorage.setItem("currentPoint", sisaPoint)
          localStorage.setItem("sisaPoint", sisaPoint)
          window.updateTopMostParent("", "", sisaPoint); 
          this.getVouchers()
        }
        this.setState({
          loadingSubmitRedeem: false
        })
    })
    .catch(err => {
        console.log(err);
    });
  }

  toggleModalRedeemShow() {
    this.setState({
      modalRedeemShow: !this.state.modalRedeemShow
    });
  }

  notifyError = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_CENTER,
      className: 'pipipol-notify',
      autoClose: 7000
    });
  };

  render() {
    const redeem = this.state.redeem;
    const userDetails = this.state.userDetails;
    const username = this.state.userDetails.username;
    // console.log(this.state.redeem[3])

    const userAvatar = this.state.userDetails.avatar;
    let $userAvatarUrl = null

    if(localStorage.getItem("userAvatar")){
      $userAvatarUrl = localStorage.getItem("userAvatar");
    }else{
      $userAvatarUrl = BaseURL+userAvatar;
    }

    const redeemItems = redeem.map(item => (
      <div key={item.id} className="card">
        <div className="card-header">
          <h5 className="card-title">{item.voucher_name}</h5>
        </div>
        <div className="card-body">
          <img
            className="card-img-top"
            src={"https://apipipipol.btoz.co.id" + item.voucher_img}
            alt={item.voucher_name}
          />
        </div>
        <div className="card-footer">
          <div className="card-poin float-left">
          < i className="fas fa-coins"></i> {item.point} <small>pts</small>
          </div>
          <div className="float-right">
            <button onClick={()=>{this.submitRedeem(item.id, item.voucher_name, item.point)}} className="btn btn-danger pl-3 pr-3">
              {this.state.loadingSubmitRedeem && (<i className="fas fa-spinner fa-spin mr-1" />)} Tukar
            </button>
          </div>
          {/* <div className="card-checkbox">
            <div className="radio radio-danger">
              <input type="radio" name="voucher" value={item.id} id={"prize" + item.id} onChange={this.handleChangeChoice} />
              <label htmlFor={"prize" + item.id} />
            </div>
          </div> */}
        </div>
      </div>
    ));

    return (

      <div
        className="site-content container-fluid"
        style={{
          backgroundImage:
            "url("+bgRedeem+")"
        }}
      >
        <ToastContainer />
        <div className="bg-container container-fluid">
          <section className="redeem container">
            <div className="redeem-header">
              <div className="row no-gutters">
                <div className="col-md-4 order-1 order-md-2">
                  <div
                    className="user-avatar"
                    style={{
                      backgroundImage: "url("+$userAvatarUrl+")"
                    }}
                  >
                    { !userAvatar ? <img className="img-fluid" src={userProfileImgDefault} alt={username} /> : "" }
                  </div>
                  <div className="user-name">
                    <h1 className="font-700">{userDetails.firstname}</h1>
                  </div>
                  <div className="user-email">{userDetails.email}</div>
                </div>
                <div className="col-md-4 order-2 order-md-1 my-auto">
                  <div className="user-poin">
                    <div className="user-poin-label">Jumlah Poin</div>
                    <div className="user-poin-total">{ !this.state.sisaPoint ? this.state.sisaPoint : this.state.sisaPoint }</div>
                  </div>
                </div>
                <div className="col-md-4 order-3 my-auto">
                  <div className="user-badge">
                  { !userDetails.badge_img ? <i className="fas fa-award" /> : <img src={BaseURL+userDetails.badge_img} alt="" /> }
                  </div>
                </div>
              </div>
            </div>

            <div className="redeem-prizes">
              <h2 className="text-center mb-5 font-700">Hadiah</h2>
              <div className="card-columns">
                {redeemItems}
              </div>
            </div>

            {/* <!-- MODAL IMAGE CAPTCHA --> */}
            <Modal id="modalRedeem" isOpen={this.state.modalRedeemShow} toggle={this.toggleModalRedeemShow} centered={true} className={this.props.className}>
              <ModalHeader toggle={this.toggleModalRedeemShow}>
                { this.state.modalTitle }
              </ModalHeader>
              <ModalBody className="p-5">
                {/* <img className="card-img-top" src={"https://apipipipol.btoz.co.id" + redeem[3].voucher_img} alt="" /> */}
                <i className="fas fa-box-open mt-2 mb-2" />
                <p>Anda telah berhasil menukarkan poin Anda dengan hadiah <strong>{this.state.nameVoucher}</strong> sebesar <strong>{this.state.pointVoucher} poin.</strong></p>
              </ModalBody>
              <ModalFooter>
                <button onClick={this.toggleModalRedeemShow} className="btn btn-danger pl-5 pr-5">
                  OK
                </button>
              </ModalFooter>
            </Modal>
            {/* <!-- /END MODAL IMAGE CAPTCHA --> */}

          </section>
        </div>
      </div>

    );
  }
}

export default Redeem;
