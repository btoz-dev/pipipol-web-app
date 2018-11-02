import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import Header from "../components/Header"
import AuthService from '../services/AuthService';

const BaseURL = `https://cors-anywhere.herokuapp.com/http://pipipol.btoz.co.id`;

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
      loadingCaptcha: false
    };
    this.Auth = new AuthService();
    this.handleChangeChoice = this.handleChangeChoice.bind(this);
    this.handleChangeCaptchaText = this.handleChangeCaptchaText.bind(this);
    this.getCaptcha = this.getCaptcha.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    if(!this.Auth.loggedIn()){
      console.log("GAK LOGIN")
      this.props.history.replace('/login');
    }else{
      console.log("LOGIN")
    }

    console.log("/* ============== */")
    console.log("=== TOKEN LAMA ===")
    console.log(this.state.AUTH_TOKEN)
    console.log(this.state.idPoll)
    console.log(this.state.idUsers)
    console.log("/* ============== */")
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

      // this.getCaptcha() // GET DATA CAPTCHA FROM API
    }
  };

  getCaptcha(ev){
    this.setState({
      loadingCaptcha: true
    });
    ev.preventDefault();
    axios.get(BaseURL + `/api/getCaptcha/` + this.state.idPoll)
      .then(res => {
        console.log(res)
        const dataCaptcha = res.data.list_captcha[0];
        const newToken = dataCaptcha.token

        localStorage.setItem("id_token", newToken);
        localStorage.setItem("isLoggedIn", newToken);

        this.setState({
          NEW_AUTH_TOKEN: localStorage.getItem("id_token", newToken),
          dataCaptcha: dataCaptcha,
          loading: false
        });

        console.log("===== STATE DATA CAPCTHA ======")
        console.log(this.state.dataCaptcha);

        this.setState({
          loadingCaptcha: false
        });

        document.getElementById("showModalCaptcha").click();
      }
    )
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

    const idPoll = this.state.activePolling.polls_id;
    const idChoice = this.state.idChoice;
    const idUsers = this.state.idUsers;
    const captcha = this.state.captchaText;

    this.setState({
      loadingSubmitPoll: true
    });

    const data = {
      idPoll,
      idChoice,
      idUsers,
      captcha
    };

    console.log("=== DATA YG BAKAL DISUBMIT ===")
    console.log(data);

    console.log("=== TOKEN BARU ===")
    console.log(this.state.NEW_AUTH_TOKEN)

    const encodedDataUser = Object.keys(data).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&');
  
    console.log(encodedDataUser)
    
    axios
      .post(`/api/submitPolls/`, data,{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Cache-Control': 'no-cache',
          'x-access-token': this.state.AUTH_TOKEN
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          loadingSubmitPoll: false,
        });
        document.getElementById("showModalPollResultsBtn").click();
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loadingSubmitPoll: false,
        });
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

    const { loading } = this.state;
    if (loading) {
      return <Loader />;
    }

    return (
      <section>
        <Header />
        <form onSubmit={this.handleSubmit}>
          <div
            className="site-content container-fluid"
            style={{
              backgroundImage:
                "url(http://pipipol.btoz.co.id" + polling.image + ")"
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
                          <i className="fas fa-user mr-1" /> {polling.kategori}
                        </span>
                        <span className="meta">
                          <i className="far fa-calendar mr-1" />{" "}
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
                        src={"http://pipipol.btoz.co.id" + polling.image}
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
                            <a
                              href="#"
                              className="poin-mobile btn btn-outline btn-lg"
                            >
                              {polling.point} poin
                            </a>
                          </div>
                          <div className="col text-right">
                            <a href="#" className="lapor-mobile btn btn-sm">
                              <i className="fas fa-exclamation-circle" />{" "}
                              Laporkan
                            </a>
                          </div>
                        </div>
                        <h2>{polling.question}</h2>
                        {answerItems}
                      </div>
                      {/* <!-- /END POLL QUESTION --> */}
                      {/* <!-- POLL CAPTCHA --> */}
                      <div className="poll-captcha row no-gutters">
                        <div className="col col-sm-12 col-md-8">
                          <label>
                            <div
                              onClick={this.getCaptcha}
                              className="btn btn-outline"
                            >
                              {this.state.loadingCaptcha && (
                              <i className="fas fa-spinner fa-spin mr-2" />
                            )}
                              <i className="fas fa-search" /> Cari Kode Sandi
                            </div>
                            <a id="showModalCaptcha"data-toggle="modal"data-target="#modalPollImageCaptcha"></a>
                          </label>
                          <input
                            name="captchaText"
                            value={this.state.captchaText}
                            onChange={this.handleChangeCaptchaText}
                            type="text"
                            placeholder="Masukan kode sandi.."
                          />
                        </div>
                        <div className="col col-sm-12 col-md-4">
                          <button type="submit" className="btn btn-danger">
                            {this.state.loadingSubmitPoll && (
                              <i className="fas fa-spinner fa-spin mr-2" />
                            )}
                            Kirim
                          </button>
                          <a
                            id="showModalPollResultsBtn"
                            data-toggle="modal"
                            data-target="#modalPollResults"
                          />
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
                    <a href="#" className="lapor">
                      <i className="fas fa-exclamation-circle" /> Laporkan
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- MODAL IMAGE CAPTCHA --> */}
          <div className="modal fade" id="modalPollImageCaptcha">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title text-center w-100">
                    Cari dan temukan kode sandi!
                  </h4>
                </div>

                <div className="modal-body text-center">
                  <img
                    className="img-fluid"
                    src={"http://pipipol.btoz.co.id" + captcha.imgUrl}
                    alt={polling.title}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark"
                  >
                    {this.state.loadingCaptcha && <i className="fas fa-spinner fa-spin mr-2" />}
                    <i className="fas fa-sync-alt mr-1"></i> Captcha
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    <i className="fas fa-window-close"></i> Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- /END MODAL IMAGE CAPTCHA --> */}

          {/* <!-- MODAL POLL RESULTS --> */}
          <div className="modal fade" id="modalPollResults">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    Terimakasih, Data Berhasil Terkirim!
                  </h4>
                </div>

                <div className="modal-body">
                  <p>
                    Poinmu bertambah: <strong>{polling.point}</strong>
                  </p>
                  <p>
                    Pilihanmu: <strong>{choosenAnswer}</strong>
                  </p>
                  <br />
                  <h5>Hasil Saat Ini</h5>
                  <div className="row">
                    <div className="col-4">Jokowi:</div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-danger"
                          style={{ width: "30%" }}
                        />
                      </div>
                    </div>
                    <div className="col-2 text-right">
                      <strong>33%</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">Soeharto:</div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-danger"
                          style={{ width: "67%" }}
                        />
                      </div>
                    </div>
                    <div className="col-2 text-right">
                      <strong>33%</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">Soekarno:</div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-danger"
                          style={{ width: "21%" }}
                        />
                      </div>
                    </div>
                    <div className="col-2 text-right">
                      <strong>33%</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">Tidak tahu:</div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-danger"
                          style={{ width: "70%" }}
                        />
                      </div>
                    </div>
                    <div className="col-2 text-right">
                      <strong>33%</strong>
                    </div>
                  </div>
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
        </form>
      </section>
    );
  }
}

export default Polling;
