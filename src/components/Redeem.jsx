import React, { Component } from "react";
import axios from "axios";
const queryString = require('query-string');

const BaseURL = "http://apipipipol.btoz.co.id";

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
      sisaPoint: localStorage.getItem("currentPoint")
    };
    this.submitRedeem = this.submitRedeem.bind(this);
  }
  componentDidMount = async () => {
    const req = await fetch(BaseURL + "/api/getVouchers/");
    const res = await req.json();
    this.setState({ redeem: res.list_vouchers, loading: false });
    console.log("REDEEM - USERDETAILS LOCALSTORAGE")
    console.log(this.state.userDetails)
  };

  submitRedeem(id, name, point) {
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
    .post(BaseURL+`/api/redeem`, dataForSubmitEncoded,{
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
        let msg = res.data.message
        let sisaPoint = res.data.sisa_point
        console.log(msg)
        if(msg === "Point anda tidak cukup"){
          this.setState({
            redeemStatus: false,
            modalTitle: "Maaf.. "+ msg,
          });
        }else{
          this.setState({
            redeemStatus: true,
            modalTitle: "Terimakasih, redeem berhasil!",
            sisaPoint: sisaPoint
          });
          localStorage.setItem("currentPoint", sisaPoint)
          localStorage.setItem("sisaPoint", sisaPoint)
          window.updateTopMostParent("", sisaPoint); 
        }
        
        document.getElementById("showModalRedeemBtn").click();
    })
    .catch(err => {
        console.log(err);
    });
  }

  render() {
    const redeem = this.state.redeem;
    const userDetails = this.state.userDetails;

    const redeemItems = redeem.map(item => (
      <div key={item.id} className="card">
        <div className="card-header">
          <h5 className="card-title">{item.voucher_name}</h5>
        </div>
        <div className="card-body">
          <img
            className="card-img-top"
            src={"http://apipipipol.btoz.co.id" + item.voucher_img}
            alt={item.voucher_name}
          />
        </div>
        <div className="card-footer">
          <div className="card-poin float-left">
          < i className="fas fa-coins"></i> {item.point} <small>pts</small>
          </div>
          <div className="float-right">
            <button onClick={()=>{this.submitRedeem(item.id, item.voucher_name, item.point)}} className="btn btn-danger pl-3 pr-3">
              Tukar
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
            "url(https://uploads.codesandbox.io/uploads/user/8a33cde4-3c2b-460f-8e6a-0515dce90c12/0pF0-bg-redeem.jpg)"
        }}
      >
        <div className="bg-container container-fluid">
          <section className="redeem container">
            <div className="redeem-header">
              <div className="row no-gutters">
                <div className="col-md-4 order-1 order-md-2">
                  <div
                    className="user-avatar"
                    style={{
                      backgroundImage: "url("+BaseURL+userDetails.avatar+")"
                    }}
                  />
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
                  { !userDetails.badge_img ? <i className="fas fa-award" /> : <img src={BaseURL+userDetails.badge_img} /> }
                  </div>
                </div>
              </div>
            </div>

            <div className="redeem-prizes">
              <h2 className="text-center mb-5 font-700">Hadiah</h2>
                <div className="card-columns">
                  {redeemItems}
                </div>
                {/* <div className="card-columns-footer">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Redeem
                  </button>
                  <a id="showModalRedeemBtn"
                    data-toggle="modal"
                    data-target="#modalRedeemSuccess"
                  >
                  </a>
                </div> */}
            </div>

            {/* <!-- MODAL REDEEM --> */}
            <a id="showModalRedeemBtn"
              data-toggle="modal"
              data-target="#modalRedeem"
            />
            <div className="modal fade" id="modalRedeem">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-center">
                  <div className="modal-header text-center">
                    <h4 className="modal-title w-100">
                      { this.state.modalTitle }
                    </h4>
                  </div>

                  <div className="modal-body pl-5 pr-5">
                    <i className="fas fa-box-open mt-2 mb-2" />
                      { this.state.modalMessage 
                        ? 
                        "Ikuti polling lebih banyak dan dapatkan poin lebih banyak lagi"
                        :
                        <p>Anda telah berhasil menukarkan poin Anda dengan hadiah <strong>{this.state.nameVoucher}</strong> sebesar <strong>{this.state.pointVoucher} poin.</strong></p>
                      }
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-dismiss="modal"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- /END MODAL POLL RESULTS --> */}
          </section>
        </div>
      </div>

    );
  }
}

export default Redeem;
