import React from "react";
import authService from "../login/auth.service";
import axios from "axios";
import Notifications from "../Notifications/Notifications.js";
import WeeklyProgress from "./weeklyProgress";
import { serverUrl } from "../../apis/serverUrl";


export default class HomePage extends React.Component {
  //Constructor declaration
  constructor(props) {
    super(props);
    //State declaration
    this.state = {
      JWT_token: JSON.parse(localStorage.getItem("user")),
      user_id: "",
      feedbacks: [],
      feedicon: [],
      notificonon: "icon feather icon-bell-off",
      cdata: {
        //this dict holds the components to be rendered along with their data such as questions and mcq choices
        content: { body: [{}] },
      },
      forms: {
        daily: 0,
        weekly: 0,
      },
    };
  }

  //if component is redenred, the following is executed
  componentWillMount() {
    const { history } = this.props;
    const firstLogin = JSON.parse(localStorage.getItem("firstLogin"));
    if (firstLogin) {
      history.push({ pathname: '/login' });
      window.location.reload();
    }
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };

    try {
    const decodedJwt = Promise.resolve(
        parseJwt(this.state.JWT_token.accessToken)
    );
      decodedJwt
        .then((value) => {
          this.setState({ user_id: value.studyId });
          if (value.role !== "patient") {
            history.push({ pathname: '/superdash' });
            window.location.reload();
          }
          axios.post(serverUrl + '/notifies/get', {
            studyId: this.state.user_id
          }).then((data) => {
            if (Object.keys(data.data.Notifications).length !== 0) {
              this.setState({ notificonon: "icon feather icon-bell" })
            } else {
              this.setState({ notificonon: "icon feather icon-bell-off" })
            }
          })
        })
        .then(() => {
          const url =
            serverUrl + "/user/getNumberForms/" + this.state.user_id;
          axios.get(url).then((result) => {
            this.setState({
              forms: { daily: result.data.daily, weekly: result.data.weekly },
            });
          });
        });
    } catch (e) { }


    try {
      const decodedJwt = Promise.resolve(parseJwt(this.state.JWT_token.accessToken));
      decodedJwt.then((value) => {
        this.setState({ user_id: value.studyId })
        axios.get(
          serverUrl + "/findfeedbackbyuser?user_id=" + this.state.user_id
        ).then((response) => {
          var feedbackicon = []
          this.setState({ feedbacks: response.data })
          for (const feedback in response.data) {
            console.log(response.data[feedback].manual)
            if (response.data[feedback].manual) {
              feedbackicon.push("fas fa-circle text-c-red f-10 m-r-15")
            } else {
              feedbackicon.push("fas fa-circle text-c-green f-10 m-r-15")
            }
          }
          this.setState({ feedicon: feedbackicon })
        })

      })
    } catch (e) { }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      const { history } = this.props;
      history.push({ pathname: "/login", search: "?redirecttologin" });
      window.location.reload();
    }
  }

  handlelogout = (event) => {
    //on click action
    event.preventDefault();
    authService.logout();
    const { history } = this.props;
    history.push("/login");
    window.location.reload();
  };

  handleclear = (event) => {
    //on click action
    event.preventDefault();
    axios.get(
      serverUrl + "/notifies/clearall?studyId=" + this.state.user_id
    )
    window.location.reload();
  };

  goToUpdatePassword() {
    const { history } = this.props;
    history.push("/profile");
    window.location.reload();
  }

  render() {
    return (
      // call conponent.js with cdata data to render the questions and the submit button the save the questions like explained before
      <body>

        <div class="loader-bg">
          <div class="loader-track">
            <div class="loader-fill"></div>
          </div>
        </div>
        <nav class="pcoded-navbar" style={{ left: 0 }}>
          <div class="navbar-wrapper">
            <div class="navbar-brand header-logo">
              <a href="home" class="b-brand">
                <div class="b-bg">
                  <img src="favicon.png" width="60" height="60"></img>
                </div>
                <span class="b-title">PAP App</span>
              </a>
              <a class="mobile-menu" id="mobile-collapse" href="javascript:"><span></span></a>
            </div>
            <div class="navbar-content scroll-div">
              <ul class="nav pcoded-inner-navbar">
                <li class="nav-item pcoded-menu-caption">
                  <label>Navigation</label>
                </li>
                <li class="nav-item active">
                  <a href="home" class="nav-link "><span class="pcoded-micon"><i class="feather icon-home"></i></span><span class="pcoded-mtext">Dashboard</span></a>
                </li>
                <li class="nav-item pcoded-menu-caption">
                  <label>Forms</label>
                </li>
                <li class="nav-item pcoded-hasmenu">
                  <a href="javascript:" class="nav-link "><span class="pcoded-micon"><i class="feather icon-file-text"></i></span><span class="pcoded-mtext">Available Forms</span></a>
                  <ul class="pcoded-submenu">
                    <li class=""><a href="dailyform" class="">Daily Form</a></li>
                    <li class=""><a href="weeklyform" class="">Weekly Form</a></li>
                  </ul>
                </li>
                <li class="nav-item pcoded-menu-caption">
                  <label>Activity Statistics</label>
                </li>
                <li class="nav-item"><a href="usergraphs" class="nav-link "><span class="pcoded-micon"><i class="feather icon-pie-chart"></i></span><span class="pcoded-mtext">Data Visualization</span></a></li>
              </ul>
            </div>
          </div>
        </nav>


        <header class="navbar pcoded-header navbar-expand-lg navbar-light">
          <div class="m-header">
            <a class="mobile-menu" id="mobile-collapse1" href="javascript:"><span></span></a>
            <a href="home" class="b-brand">
              <div class="b-bg">
                <img src="favicon.png" width="60" height="60" />
              </div>
              <span class="b-title">PAP App</span>
            </a>
          </div>
          <a class="mobile-menu" id="mobile-header" href="javascript:">
            <i class="feather icon-more-horizontal"></i>
          </a>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav ml-auto">
              <li>
                <div class="dropdown">
                  <a class="dropdown-toggle" href="javascript:" data-toggle="dropdown"><i class={this.state.notificonon}></i></a>
                  <div class="dropdown-menu dropdown-menu-right notification">
                    <div class="noti-head">
                      <h6 class="d-inline-block m-b-0">Notifications</h6>
                      <div class="float-right">
                        <a href="" onClick={this.handleclear}>clear all</a>
                      </div>
                    </div>
                    <ul class="noti-body">
                      <li>
                        <div >
                          <div>
                            <Notifications user_id={this.state.user_id} />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown drp-user">
                  <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="icon feather icon-settings"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right profile-notification" onClick={() => this.goToUpdatePassword()} style={{cursor: 'pointer'}}>
                    <div class="pro-head">
                      <img src="assets/images/user/userneutral.png" class="img-radius" alt="User-Profile-Image" />
                      <span>{this.state.user_id}</span>
                    </div>

                  </div>
                </div>
              </li>
              <li>
                <a href="" class="dud-logout" title="Logout">
                  <i class="feather icon-log-out" onClick={this.handlelogout}></i>
                </a>
              </li>
            </ul>
          </div>
        </header>



        <div class="pcoded-main-container">
          <div class="pcoded-wrapper">
            <div class="pcoded-content">
              <div class="pcoded-inner-content">
                <div class="main-body">
                  <div class="page-wrapper">


                    <div class="row">
                      <div class="col-xl-12 col-md-6">
                        <div class="card daily-sales">
                          <WeeklyProgress userId={this.state.user_id}/>
                        </div>
                      </div>

                      <div class="col-xl-12 col-md-6">
                        <div class="card daily-sales">
                          <div class="card-block">
                            <div class="row d-flex align-items-center">
                              <div class="col-9">
                                <h5 class="card-header">
                                  Number of daily forms filled until now
                                </h5>
                              </div>

                              <div class="col-3 text-right">
                                <h5 class="m-b-0">{this.state.forms.daily}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-xl-12 col-md-6">
                        <div class="card daily-sales">
                          <div class="card-block">
                            <div class="row d-flex align-items-center">
                              <div class="col-9">
                                <h5 class="card-header">
                                  Number of weekly forms filled until now
                                </h5>
                              </div>

                              <div class="col-3 text-right">
                                <h5 class="m-b-0">{this.state.forms.weekly}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div class="col-xl-12 col-md-6">
                        <div class="card Recent-Users">
                          <div class="card-header">
                            <h5>Feedbacks</h5>
                          </div>
                          <div class="card-block px-0 py-3">
                            <div class="table-responsive">
                              <table class="table table-hover">
                                <tbody>
                                  {this.state.feedbacks.map((feedback, index) => (
                                    <tr class="unread">
                                      <td>
                                        <h6 class="text-muted"><i class={this.state.feedicon[index]}></i>{feedback.date.split("T")[0]}</h6>
                                        <h6 class="mb-1">{feedback.feedback}</h6>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </body>
    );
  }
}
