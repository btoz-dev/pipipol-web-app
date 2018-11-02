import React, { Component } from "react";
import axios from "axios";
import Header from "../components/Header"

const BaseURL = "http://pipipol.btoz.co.id";

class Redeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: [],
      redeem: [],
      username: "",
      idVoucher: "",
      loading: true,
      loadingSubmitRedeem: false
    };
    this.handleChangeChoice = this.handleChangeChoice.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount = async () => {
    const req = await fetch(BaseURL + "/api/getVouchers/");
    const res = await req.json();
    this.setState({ redeem: res.list_vouchers, loading: false });

    const localUserDetails = this.getUserDetails()
    this.setState({
      userDetails: JSON.parse(localUserDetails)
    })
    console.log("REDEEM - USERDETAILS LOCALSTORAGE")
    console.log(this.state.userDetails)
  };

  getUserDetails() {
    return localStorage.getItem('userDetails')
  }

  handleChangeChoice(ev){
    this.setState({
      username: "XXX",
      idVoucher: ev.target.value,
    })
  }

  handleSubmit(ev){
    ev.preventDefault();

    const username = this.state.username
    const idVoucher = this.state.idVoucher

    this.setState({
      loadingSubmitRedeem: true
    })

    const data = {
      username,
      idVoucher
    }

    console.log(data)

    axios.post(BaseURL + `/api/redeeem/`, data)
    .then(res => {
      console.log(res)
      console.log(res.data)

      this.setState({
        loadingSubmitRedeem: false,
        message: res.data
      })
      document.getElementById("showModalRedeemBtn").click();
    })
    .catch(err => {
      console.log(err)
      this.setState({
        loadingSubmitRedeem: false,
        message: err.data
      })
    })

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
            src={"http://pipipol.btoz.co.id" + item.voucher_img}
            alt={item.voucher_name}
          />
        </div>
        <div className="card-footer">
          <div className="card-poin">
            {item.point} <em>poin</em>
          </div>
          <div className="card-checkbox">
            <div className="checkbox checkbox-danger">
              <input type="checkbox" value={item.id} id={"prize" + item.id} onChange={this.handleChangeChoice} />
              <label htmlFor={"prize" + item.id} />
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div>
        <Header />
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
                    <div className="user-poin-total">{ !userDetails.point && 0 } {userDetails.point}</div>
                  </div>
                </div>
                <div className="col-md-4 order-3 my-auto">
                  <div className="user-badge">
                    <i className="fas fa-award" />
                    <i className="fas fa-award" />
                    <i className="fas fa-award" />
                  </div>
                </div>
              </div>
            </div>

            <div className="redeem-prizes">
              <h2 className="text-center mb-5 font-700">Hadiah</h2>
              <form role="form" onSubmit={this.handleSubmit}>
                <div className="card-columns">{redeemItems}</div>
                <div className="card-columns-footer">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Redeem
                  </button>
                  <a id="showModalRedeemBtn"
                    data-toggle="modal"
                    data-target="#modalRedeemSuccess"
                  >
                  </a>
                </div>
              </form>
            </div>

            {/* <!-- MODAL POLL RESULTS --> */}
            <div className="modal fade" id="modalRedeemSuccess">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-center">
                  <div className="modal-header text-center">
                    <h4 className="modal-title w-100">
                      Terimakasih, redeem berhasil!
                    </h4>
                  </div>

                  <div className="modal-body">
                    <i className="fas fa-box-open mt-2 mb-2" />
                    <p>
                      Anda telah berhasil menukarkan poin Anda dengan hadiah
                      XXXXXXXX sebesar 70 poin.
                    </p>
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
      </div>
    );
  }
}

export default Redeem;
