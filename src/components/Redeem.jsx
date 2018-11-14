import React, { Component } from "react";
import axios from "axios";
import userProfileImgDefault  from'./../img/ic-user.png';
import bgRedeem  from'./../img/bg-redeem.jpg';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import sort from 'fast-sort';

import classnames from 'classnames';

const queryString = require('query-string');

var scrollToElement = require('scroll-to-element');

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
      modalRedeemHistoryShow: false,
      redeemMessage: "",
      activeItem: -1,
      activeTab: '1',
      redeemHistory: [],
      redeemHistoryDate: '',
      redeemHistoryName: '',
      redeemHistoryImage: '',
      redeemHistoryPoint: ''
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.submitRedeem = this.submitRedeem.bind(this);
    this.toggleModalRedeemShow = this.toggleModalRedeemShow.bind(this);
    this.toggleModalRedeemHistoryShow = this.toggleModalRedeemHistoryShow.bind(this);
    this.toggleModalRedeemHistoryHide = this.toggleModalRedeemHistoryHide.bind(this);
    this.getRedeemHistory = this.getRedeemHistory.bind(this);
  }

  componentDidMount (){
    this.timer = setInterval(
      () => this.getVouchers(),
      1000,
    );

    scrollToElement('#topPage', {
      offset: -88,
      ease: 'inOutQuad',
      duration: 700
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async getVouchers(){
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

  submitRedeem(index, id, name, point) {

    this.setState({
      idVoucher: id,
      nameVoucher: name,
      pointVoucher: point,
      loadingSubmitRedeem: true,
      activeItem: index
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
          loadingSubmitRedeem: false,
          activeItem: -1
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


  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      }, () => {
        if(tab === '2'){
          this.getRedeemHistory()
        }
      });
      
    }
  }

  toggleModalRedeemHistoryShow(name, img) {
    console.log(img)
    this.setState({
      redeemHistoryName: name,
      redeemHistoryImage: img,
      modalRedeemHistoryShow: !this.state.modalRedeemHistoryShow
    });
  }

  toggleModalRedeemHistoryHide(){
    this.setState({
      modalRedeemHistoryShow: !this.state.modalRedeemHistoryShow
    });
  }

  async getRedeemHistory(){
    this.setState({
      loadingTab: true
    });

    axios.get(BaseURL + `/api/redeemHistory`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Cache-Control': 'no-cache',
        'x-access-token': this.state.AUTH_TOKEN,
      },
      credentials: 'include',
    })
      .then(res => {
        console.log(res)
        const redeemHistory = res.data.listRedeem;

        console.log(redeemHistory)

        this.setState({
          redeemHistory: redeemHistory,
          redeemHistoryDate: redeemHistory.tgl_redeem,
          redeemHistoryName: redeemHistory.voucher_name,
          redeemHistoryPoint: redeemHistory.point,
          redeemHistoryImage: redeemHistory.voucher_img,
          loadingTab: false
        });
      }
    )
  }

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

    const redeemHistory = sort(this.state.redeemHistory).desc('tgl_redeem')

    const listRedeemHistory = redeemHistory.map(list => (
      <tr className="anim" key={list.id} onClick={() => this.toggleModalRedeemHistoryShow(list.voucher_name, list.voucher_img)}>
        <td>{list.tgl_redeem}</td>
        <td>{list.voucher_name}</td>
        <td>{list.point}</td>
        <td><button className="btn btn-dark btn-sm pl-3 pr-3" onClick={() => this.toggleModalRedeemHistoryShow(list.voucher_name, list.voucher_img)}>Lihat</button></td>
      </tr>
    ));


    

    const redeemItems = redeem.map((item, index) => (
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
            <button 
              onClick={()=>{this.submitRedeem(index, item.id, item.voucher_name, item.point)}} 
              className="btn btn-danger">
              <i className={this.state.activeItem === index ? 'fas fa-spinner fa-spin mr-1' : 'd-none'} />Tukar
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
        <div id="topPage" className="bg-container container-fluid pb-3">
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
                    { $userAvatarUrl === '"https://apipipipol.btoz.co.idnull"' ? <img className="img-fluid user-avatar-default" src={userProfileImgDefault} alt={username} /> : "" }
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

              <div class="container mt-5">
                <Nav tabs className="justify-content-center">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '1' })}
                      onClick={() => { this.toggleTab('1'); }}>
                      <h4 className="anim">Hadiah</h4>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '2' })}
                      onClick={() => { this.toggleTab('2'); }}>
                      <h4 className="anim">History</h4>
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>

            </div>

            <TabContent activeTab={this.state.activeTab}>
              
              <div className="container text-center">
                <i className={this.state.loading ? 'fas fa-spinner fa-spin ml-1 font-size-3' : 'd-none'} />
              </div>

              {/* TAB 1 */}
              <TabPane tabId="1" className={classnames('fade', { show: this.state.activeTab === '1' })}>
                <div className="redeem-prizes">
                  {/* <h2 className="text-center mb-5 pb-4 font-700">Hadiah <i className={this.state.loading ? 'fas fa-spinner fa-spin ml-1' : 'd-none'} /></h2> */}
                  <div className="card-columns">
                    {redeemItems}
                  </div>
                </div>
              </TabPane>

              {/* TAB 2 */}
              <TabPane tabId="2" className={classnames('fade mb-5', { show: this.state.activeTab === '2' })}>
                <div className="redeem-prizes">
                  {/* <h2 className="text-center mb-5 pb-4 font-700">History <i className={this.state.loading ? 'fas fa-spinner fa-spin ml-1' : 'd-none'} /></h2> */}
                  <div className="">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th className="th-date">Tanggal</th>
                          <th className="th-prize">Hadiah</th>
                          <th className="th-point">Poin</th>
                          <th className="th-image">Gambar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listRedeemHistory}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </TabPane>

            </TabContent>



            

            {/* <!-- MODAL PRIZE --> */}
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
            {/* <!-- /END MODAL PRIZE --> */}




            {/* <!-- MODAL PRIZE --> */}
            <Modal id="modalRedeemHistory" isOpen={this.state.modalRedeemHistoryShow} toggle={this.modalRedeemHistoryShow} centered={true} className={this.props.className}>
              <ModalHeader toggle={this.toggleModalRedeemHistoryShow}>
                { this.state.redeemHistoryName }
              </ModalHeader>
              <ModalBody className="p-5">
                <img className="card-img-top" src={"https://apipipipol.btoz.co.id" + this.state.redeemHistoryImage} alt={this.state.redeemHistoryName} />
              </ModalBody>
              <ModalFooter>
                <button onClick={this.toggleModalRedeemHistoryHide} className="btn btn-danger pl-5 pr-5">
                  OK
                </button>
              </ModalFooter>
            </Modal>
            {/* <!-- /END MODAL PRIZE --> */}

          </section>
        </div>
      </div>

    );
  }
}

export default Redeem;
