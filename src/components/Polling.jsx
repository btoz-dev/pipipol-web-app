import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import AuthService from '../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PollingResults from '../components/PollingResults';

const BaseURL = `https://apipipipol.btoz.co.id`;

class Polling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AUTH_TOKEN: localStorage.getItem("id_token"),
      NEW_AUTH_TOKEN: "",
      idPoll: this.props.location.state.polling,
      idUsers: localStorage.getItem("userid"),
      activePolling: [],
      activeAnswers: [],
      dataCaptcha: [],
      choosenAnswer: "",
      captchaText: "",
      idChoice: "",
      loading: true,
      loadingSubmitPoll: false,
      loadingCaptcha: false,
      submitMessage: "Maaf, Pilihan dan Kode Sandi tidak boleh kosong!",
      modalResultsShow: false,
      modalResultsOnlyShow: false,
      modalCaptchaShow: false,
      modalReportShow: false,
      pollingResults: [],
      polled: false,
      pollRespondents: localStorage.getItem("pollRespondents"),
      reportReason: '',

    };
    this.Auth = new AuthService();
    this.handleChangeChoice = this.handleChangeChoice.bind(this);
    this.handleChangeCaptchaText = this.handleChangeCaptchaText.bind(this);
    this.getCaptcha = this.getCaptcha.bind(this);
    this.submitPoll = this.submitPoll.bind(this);
    this.submitReport = this.submitReport.bind(this);
    this.handleChangeChoiceReport = this.handleChangeChoiceReport.bind(this);
    this.toggleModalCaptchaShow = this.toggleModalCaptchaShow.bind(this);
    this.toggleModalResultsShow = this.toggleModalResultsShow.bind(this);
    this.toggleModalResultsOnlyShow = this.toggleModalResultsOnlyShow.bind(this);
    this.toggleModalReportShow = this.toggleModalReportShow.bind(this);
  }

  componentWillMount(){
    if(!this.Auth.loggedIn()){
      console.log("GAK LOGIN")
      this.props.history.replace('/login');
    }else{
      console.log("LOGIN")
    }
  }

  componentDidMount = async () => {
    if(this.state.AUTH_TOKEN){
      const req = await fetch(BaseURL + "/api/getDetailPolls/" + this.state.idPoll);
      const res = await req.json();
      this.setState({ 
        activePolling: res.list_detail_polls[0], 
        activeAnswers: res.list_detail_polls[0].answers,
        loading: false
      });
      localStorage.setItem("pollRespondents", res.list_detail_polls[0].popularity)
      console.log(res)
    }
  };

  async getCaptcha(){
    this.setState({
      loadingCaptcha: true,
      modalCaptchaShow: true
    });

    console.log(this.state.AUTH_TOKEN)

    axios.get(BaseURL + `/api/getCaptcha/` + this.state.idPoll, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Cache-Control': 'no-cache',
        'x-access-token': this.state.AUTH_TOKEN,
      },
      credentials: 'include',
    })
      .then(res => {
        console.log(res)
        const dataCaptcha = res.data.list_captcha[0];
        const newToken = dataCaptcha.token

        console.log(dataCaptcha.captchaText)

        localStorage.setItem("id_token", newToken);
        localStorage.setItem("isLoggedIn", newToken);

        this.setState({
          NEW_AUTH_TOKEN: localStorage.getItem("id_token", newToken),
          dataCaptcha: dataCaptcha,
          loadingCaptcha: false,
          modalCaptchaShow: true
        });
      }
    )
  }

  encodedData(data) {
    return Object.keys(data).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }

  handleChangeChoice(ev) {
    this.setState({
      idChoice: ev.target.value,
      choosenAnswer: this.state.activeAnswers[ev.target.value - 1].answer
    });
  }

  handleChangeCaptchaText(ev) {
    this.setState({
      captchaText: ev.target.value
    });
  }

  handleSubmit(ev) {
    ev.preventDefault();

    const idPoll = this.state.idPoll;
    const idChoice = this.state.idChoice;
    const idUsers = this.state.idUsers;
    const captcha = this.state.captchaText;

    const dataForSubmit = {
      idPoll,
      idChoice,
      idUsers,
      captcha
    };

    this.setState({
      loadingSubmitPoll: true
    });

    axios
      .post(`/api/submitPolls/`, this.encodedData(dataForSubmit),{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Cache-Control': 'no-cache',
          'x-access-token': this.state.NEW_AUTH_TOKEN
        }
      })
      .then(res => {
        console.log(res.data);
        const dataSubmitPoll = res.data
        const submitMessage = dataSubmitPoll.message
        const submitSuccess = dataSubmitPoll.submitPolls
        const pollingResults = dataSubmitPoll.result_polling
        const pollingPoint = parseInt(this.state.activePolling.point)
        const currentPoint = parseInt(localStorage.getItem('currentPoint'))
        const totalPoint = parseInt(pollingPoint + currentPoint)

        console.log("HITUNG POINT")
        console.log(pollingPoint)
        console.log(currentPoint)
        console.log(totalPoint)

        this.setState({
          submitMessage: submitMessage,
          pollingResults: pollingResults
        });

        if(submitSuccess){
          console.log("SUCCESS!")
          
          // KIRIM STATE KE PARENT PALING ATAS
          window.updateTopMostParent("", "", totalPoint); 

          this.setState({
            modalResultsShow: true,
            polled: true
          });
        }else{
          console.log("GAK BERHASIL")
          this.notifyError()
        }
        console.log(this.state.submitMessage)

        this.setState({
          loadingSubmitPoll: false,
        });        
      })
      .catch(err => {
        this.setState({
          loadingSubmitPoll: false,
          submitMessage: "Maaf terjadi kesalahan.. Silahkan periksa kembali Kode Sandi!"
        });
        this.notifyError()
        console.log(err.message);
      });
  }

  submitPoll(ev){
    ev.preventDefault();
    if(this.state.idChoice !== "" && this.state.captchaText !== ""){
      console.log("ISIII")
      this.handleSubmit(ev)
    }else{
      this.setState({
        submitMessage: "Maaf, Pilihan dan Kode Sandi tidak boleh kosong!"
      });
      this.notifyError()
    }
  }


  handleChangeChoiceReport(ev) {
    this.setState({
      reportReason: ev.target.value,
    });
    
  }
  submitReport(){

    const idPoll = this.state.idPoll;
    const reason = this.state.reportReason

    const dataForSubmit = {
      idPoll,
      reason
    };

    if(reason !== ''){
      this.setState({
        loadingSubmitReport: true
      });

      axios
      .post(`/api/report-polls`, this.encodedData(dataForSubmit), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Cache-Control': 'no-cache',
          'x-access-token': this.state.AUTH_TOKEN,
        },
        credentials: 'include',
      })
      .then(res => {
          console.log("=== RESPONSE REPORT ===")
          console.log(res);
          console.log(res.data);
          let report = res.data.report
          let msg = res.data.message
          console.log(msg)

          if(report){
            this.notifyReport(msg)
          }else{
            this.notifyReportError(msg)
          }
          this.setState({
            loadingSubmitRedeem: false
          })
          this.toggleModalReportShow()
      })
      .catch(err => {
          console.log(err);
          this.notifyReportError(err)
      });
    }else{
      this.notifyReportError("Silahkan memilih alasan pelaporan terlebih dahulu, terima kasih.")
    }
  }

  notify = () => {
    toast(this.state.submitMessage, {
      position: toast.POSITION.TOP_CENTER,
      className: 'pipipol-notify',
      autoClose: 7000
    });
  };

  notifyError = () => {
    toast.error(this.state.submitMessage, {
      position: toast.POSITION.TOP_CENTER,
      className: 'pipipol-notify',
      autoClose: 7000
    });
  };

  notifyReport = (msg) => {
    toast(msg, {
      position: toast.POSITION.TOP_CENTER,
      className: 'pipipol-notify',
      autoClose: 7000
    });
  };
  notifyReportError = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_CENTER,
      className: 'pipipol-notify',
      autoClose: 7000
    });
  };

  toggleModalCaptchaShow() {
    this.setState({
      modalCaptchaShow: !this.state.modalCaptchaShow
    });
  }
  toggleModalResultsShow() {
    this.setState({
      modalResultsShow: !this.state.modalResultsShow
    });
  }
  toggleModalResultsOnlyShow() {
    this.setState({
      modalResultsOnlyShow: !this.state.modalResultsOnlyShow
    });
  }
  toggleModalReportShow() {
    this.setState({
      modalReportShow: !this.state.modalReportShow
    });
  }

  render() {
    const polling = this.state.activePolling;
    const answers = this.state.activeAnswers;
    const captcha = this.state.dataCaptcha;
    const choosenAnswer = this.state.choosenAnswer;

    const answerItems = answers.map(item => (
      <div key={item.id} className="radio radio-danger">
        <input
          type="radio"
          name="idChoice"
          id={"radioAnswer" + item.id}
          value={item.id}
          onChange={this.handleChangeChoice}
        />
        <label htmlFor={"radioAnswer" + item.id}>{item.answer}</label>
      </div>
    ));


    const reasons = ['Pornografi', 'Kekerasan', 'Pelecehan', 'HOAX', 'Spam', 'Ujaran Kebencian', 'Penjualan Tidak Resmi', 'Terorisme'];
    const reasonItems = reasons.map((reason, index) => (
      <div key={index} className="radio radio-danger d-inline-block mr-1">
        <input
          type="radio"
          name="reason"
          id={"radioReason" + index}
          value={reason}
          onChange={this.handleChangeChoiceReport}
        />
        <label className="black" htmlFor={"radioReason" + index}>{reason}</label>
      </div>
    ));

    const { loading } = this.state;
    if (loading) {
      return <Loader />;
    }

    return (
      <section>
          <ToastContainer />
          <div
            className="site-content container-fluid"
            style={{
              backgroundImage:
                "url(https://apipipipol.btoz.co.id" + polling.image + ")"
            }}
          >
            <div className="bg-container container-fluid p-3">
              <div className="poll-single container">
                <div className="poll-single-header row">
                  <div className="col-lg-10 col-md-9 col-sm-12">
                    <div className="btn-back">
                      <NavLink to="/" className="btn btn-dark mb-3">
                        <i className="fas fa-arrow-alt-circle-left mr-1" />{" "}
                        <span>Kembali ke Polling</span>
                      </NavLink>
                    </div>
                    <div className="poll-title">
                      <h1>{polling.title}</h1>
                    </div>
                    <div className="poll-meta">
                      <i className="fas fa-user meta mr-1" />{" "}
                      <span className="meta mr-4">{polling.creator} </span>
                      <span className="d-inline-block d-md-none">
                        <span className="meta mr-4">
                          <i className="fas fa-tag mr-1" /> {polling.kategori}
                        </span>
                        <span className="meta">
                          <i className="far fa-calendar-alt mr-1" />{" "}
                          {polling.expired} hari lagi
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12 d-none d-md-block text-center">
                    <div className="poll-exp-date">
                      <i className="far fa-calendar">
                        <span>{polling.expired}</span>
                      </i>hari lagi
                    </div>
                    <div className="poll-category btn btn-outline">
                      {polling.kategori}
                    </div>
                  </div>
                </div>

                <div className="poll-single-body row">
                  <div className="col-md-4 col-sm-12 poll-body-left">
                    <div className="poll-image">
                      <img
                        className="img-fluid"
                        src={"https://apipipipol.btoz.co.id" + polling.image}
                        alt={polling.title}
                      />
                    </div>
                  </div>
                  <div className="col col-sm-9 col-md-5 col-lg-6 poll-body-center">
                    <div className="row no-gutters">
                      {/* <!-- POLL QUESTION --> */}
                      <div className="poll-question">
                        <div className="poll-body-right-mobile row mb-3 d-flex d-sm-none">
                          <div className="col">
                            <div
                              className="poin-mobile btn btn-outline btn-lg"
                            >
                              {polling.point} poin
                            </div>
                          </div>
                          <div className="col text-right">
                            <button  onClick={this.toggleModalReportShow} className="btn-lapor-mobile">
                              <i className="fas fa-exclamation-circle" />{" "}
                              Laporkan
                            </button>
                          </div>
                        </div>
                        <h2>{polling.question}</h2>
                        {answerItems}
                      </div>
                      {/* <!-- /END POLL QUESTION --> */}
                      {/* <!-- POLL CAPTCHA --> */}
                      <div className="poll-captcha row">
                      { this.state.polled 
                        ?
                        <div></div>
                        :
                        <div className="col-8">
                          <label>
                            <div
                              onClick={this.getCaptcha}
                              className="btn btn-outline mb-2"
                            >
                              {this.state.loadingCaptcha ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-search" />} Cari Kode Sandi
                            </div>
                          </label>
                          {/* <input
                            name="captchaText"
                            value={this.state.captchaText}
                            onChange={this.handleChangeCaptchaText}
                            type="text"
                            placeholder="Masukan kode sandi.."
                            autocomplete="off"
                          /> */}
                        </div>
                      }

                        <div className="col-4">
                          { this.state.polled 
                            ?
                            <button onClick={this.toggleModalResultsShow} className="btn btn-danger">
                              {this.state.loadingSubmitPoll && (
                                <i className="fas fa-spinner fa-spin mr-2" />
                              )}
                              Hasil
                            </button>
                            :
                            <button onClick={this.submitPoll} className={this.state.idChoice !== "" && this.state.captchaText !== "" ? 'btn btn-danger' : 'btn btn-danger disabled'}>
                              {this.state.loadingSubmitPoll && (
                                <i className="fas fa-spinner fa-spin mr-2" />
                              )}
                              Kirim
                            </button>
                          }
                          
                        </div>
                      </div>
                      {/* <!-- /END POLL CAPTCHA --> */}
                    </div>
                  </div>
                  <div className="col-3 col-lg-2 poll-body-right d-none d-sm-flex">
                    <div className="poll-value-point">
                      <span className="value">{polling.point}</span>{" "}
                      <small>poin</small>
                    </div>
                    <button onClick={this.toggleModalReportShow} className="btn-lapor">
                      <i className="fas fa-exclamation-circle" /> Laporkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- MODAL IMAGE CAPTCHA --> */}
          <Modal isOpen={this.state.modalCaptchaShow} toggle={this.toggleModalCaptchaShow} centered={true} className={this.props.className}>
            <ModalHeader toggle={this.toggleModalCaptchaShow}>
              Cari dan temukan kode sandi!
            </ModalHeader>
            <ModalBody className="poll-captcha">
              {captcha.imgUrl 
              ?
              <img className="img-fluid" src={"https://apipipipol.btoz.co.id" + captcha.imgUrl} alt="Cari dan temukan kode sandi!" />
              :
              <span><i className="fas fa-spinner fa-spin text-center mr-1" /> Loading kode sandi..</span>
              }
              <div className="row mt-3">
                <div className="col">
                  <input
                    className="text-center"
                    name="captchaText"
                    value={this.state.captchaText}
                    onChange={this.handleChangeCaptchaText}
                    type="text"
                    placeholder="Masukan kode sandi.."
                    autocomplete="off"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button onClick={this.getCaptcha} className="btn btn-dark">
                <i className= { this.state.loadingCaptcha ? "fas fa-sync mr-2 fa-spin" : "fas fa-sync mr-2"} />
                Captcha
              </button>
              <button onClick={this.toggleModalCaptchaShow} className="btn btn-danger">
                Tutup
              </button>
              {/* <button onClick={this.submitPoll} className="btn btn-danger">
                {this.state.loadingSubmitPoll && (
                  <i className="fas fa-spinner fa-spin mr-2" />
                )}
                Kirim
              </button> */}
            </ModalFooter>
          </Modal>
          {/* <!-- /END MODAL IMAGE CAPTCHA --> */}

          {/* <!-- MODAL POLL RESULTS --> */}
          <Modal isOpen={this.state.modalResultsShow} toggle={this.toggleModalResultsShow} centered={true} className={this.props.className}>
            <ModalHeader toggle={this.toggleModalResultsShow}>
              Terimakasih Sudah Mengikuti Polling!
            </ModalHeader>
            <ModalBody>
              <p>
                Poinmu bertambah: <strong>{polling.point} poin.</strong>
              </p>
              <p>
                Pilihanmu: <strong>{choosenAnswer}</strong>
              </p>
              <br />
              <h5>Hasil saat ini dari <strong>{localStorage.getItem("pollRespondents")} responden</strong></h5>

              <PollingResults pollingResults={this.state.pollingResults} />

            </ModalBody>
            <ModalFooter>
              <NavLink to="/" className="btn btn-dark">
                <i className="fas fa-arrow-alt-circle-left mr-1" />{" "}
                <span>Polling Lainnya</span>
              </NavLink>
              <button onClick={this.toggleModalResultsShow} className="btn btn-danger">Tutup</button>
            </ModalFooter>
          </Modal>
          {/* <!-- /END MODAL POLL RESULTS --> */}

          {/* <!-- MODAL LAPOR --> */}
          <Modal isOpen={this.state.modalReportShow} toggle={this.toggleModalReportShow} centered={true} className={this.props.className}>
            <ModalHeader>
              Beri Masukan tentang Polling Ini!
            </ModalHeader>
            <ModalBody>
              <h5 className="mb-4">Kami akan menggunakan masukan Anda untuk mengetahui ketika ada sesuatu yang salah.</h5>
              <div className="">
                {reasonItems}
              </div>
            </ModalBody>
            <ModalFooter>
              <button onClick={this.toggleModalReportShow} className="btn btn-dark">Batalkan</button>
              <button onClick={this.submitReport} className="btn btn-danger">Kirim</button>
            </ModalFooter>
          </Modal>
          {/* <!-- /END MODAL LAPOR --> */}
      </section>
    );
  }
}

export default Polling;
