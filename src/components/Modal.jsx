<div className="poll-captcha row no-gutters">
    <div className="col col-sm-12 col-md-8">
    <label>
        <a
        href="#"
        className="btn btn-outline"
        data-toggle="modal"
        data-target="#modalPollImageCaptcha"
        >
        <i className="fas fa-search" /> Cari Kode Sandi
        </a>
    </label>
    <input name="captchaText" value={this.state.captchaText} onChange={this.handleChangeCaptchaText} type="text" placeholder="Masukan kode sandi.." />
    </div>
    <div className="col col-sm-12 col-md-4">
    <button
        type="submit"
        className="btn btn-danger"
    >
        {this.state.loadingSubmitPoll &&
        <i className="fas fa-spinner fa-spin mr-2" />
        }
        Kirim
    </button>
    <a id="showModalPollResultsBtn"
        data-toggle="modal"
        data-target="#modalPollResults"
    >
    </a>
    </div>
</div>