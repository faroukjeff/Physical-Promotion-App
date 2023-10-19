import axios from "axios";
import React from "react";
import authService from "../login/auth.service";
import { serverUrl } from '../../apis/serverUrl';

export default class SupervisorPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      JWT_token: JSON.parse(localStorage.getItem("user")),
      user_id: "",
      userInfo:{
        userId: "xxxxxxx",
        userPassword: "xxxxxx",
      },
      newPassword:"",
      changePasswordUserId:"",
      mFeedback:"",
      mNotification:"",
      userNotif:"",
      userFeed:""
    }
  }

  componentWillMount() {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };
    try{
    const decodedJwt = Promise.resolve(parseJwt(this.state.JWT_token.accessToken));
    decodedJwt.then( (value) =>{
      this.setState({user_id:value.studyId})
      if(value.role !== "supervisor"){
        const { history } = this.props;
        history.push({pathname: '/login'});
        window.location.reload();
        alert("You are not a Supervisor")
      }
    })}catch (e){
      const { history } = this.props;
      history.push({pathname: '/login', search:"?redirecttologin" });
      window.location.reload();
    }

  }

   createNewUser() {
    axios({
      method: "get",
      url: serverUrl+"/supervisor/createNewUser",
    }).then((res) => {
      this.setState({userInfo:res.data})
    });
  }

    modifyUserPassword() {
    if (this.state.changePasswordUserId === "" || this.state.changePasswordUserId === undefined) {
      alert("Please enter user id");
      return;
    }

    axios
      .post(serverUrl+"/supervisor/changePassword", {
        userId: this.state.changePasswordUserId,
      })
      .then((res) => {
        this.setState({newPassword:"New Password" + res.data.userPassword})
      })
      .catch((err) => {
        console.log("ERR USER")
        this.setState({newPassword:"This user does not exist"})
      });
  }

  handlelogout = (event) => {
    //on click action
    event.preventDefault();
    authService.logout();
    const { history } = this.props;
    history.push("/login");

    window.location.reload();
  };

  onChangeValueFeeduser = event =>{this.setState({userFeed:event})}
  onChangeValueFeedtext = event =>{this.setState({mFeedback:event})}
  onChangeValueNotifuser = event =>{this.setState({userNotif:event})}
  onChangeValueNotiftext = event =>{this.setState({mNotification:event})}

  sendFeedback(){
    try{
      axios.get(serverUrl+"/sendfeedback?user_id=" + this.state.userFeed + "&feedback=" + this.state.mFeedback +"&manual=true")
      this.setState({mFeedback:""})
      this.setState({userFeed:""})
    
    }catch(e){
      alert("Feedback could not be sent")
    }
    }

  sendnotif(){
    try{
      axios.post(serverUrl +"/notifies/add",
     {
        studyId:this.state.userNotif,
        title:this.state.mNotification,
        text:this.state.mNotification

     })
     this.setState({mNotification:""})
     this.setState({userNotif:""})
    }catch(e){
      alert("Notification could not be sent")
     }

  }
  render(){
  return (
    <>
      <nav class="pcoded-navbar navbar-collapsed" style={{ left: 0 }}>
        <div class="navbar-wrapper">
          <div class="navbar-brand header-logo">
            <a href="home" class="b-brand">
              <div class="b-bg">
                <img src="favicon.png" width="60" height="60" />
              </div>
              <span class="b-title">PAP App</span>
            </a>
            <a class="mobile-menu" id="mobile-collapse" href="javascript:">
              <span></span>
            </a>
          </div>
          <div
            class="slimScrollDiv"
            style={{
              position: "relative",
              overflow: "hidden",
              width: 100 + "%",
              height: 'calc(100 + "vh" - 70 + "px")',
            }}
          >
            <div
              class="navbar-content scroll-div"
              style={{
                overflow: "hidden",
                width: 100 + "%",
                height: 'calc(100 + "vh" - 70 + "px")',
              }}
            >
              <ul class="nav pcoded-inner-navbar">
                <li class="nav-item pcoded-menu-caption">
                  <label>Home</label>
                </li>
                <li class="nav-item">
                  <a href="superdash" class="nav-link ">
                    <span class="pcoded-micon">
                      <i class="feather icon-home"></i>
                    </span>
                    <span class="pcoded-mtext">Dashboard</span>
                  </a>
                </li>
                <li class="nav-item pcoded-menu-caption">
                  <label>Users Data</label>
                </li>
                <li class="nav-item">
                      <a href="answerview" class="nav-link ">
                        <span class="pcoded-micon">
                          <i class="feather icon-file-text"></i>
                        </span>
                        <span class="pcoded-mtext">Form Answers</span>
                      </a>
                    </li>
                <li class="nav-item active">
                  <a href="supervisor" class="nav-link ">
                    <span class="pcoded-micon">
                      <i class="feather icon-user"></i>
                    </span>
                    <span class="pcoded-mtext">User Management</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <header class="navbar pcoded-header navbar-expand-lg navbar-light">
        <div class="m-header">
            <a class="mobile-menu" id="mobile-collapse1" href="javascript:"><span></span></a>
            <a href="home" class="b-brand">
                   <div class="b-bg">
                   <img src="favicon.png" width="40" height="40" />
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
                    <div class="dropdown drp-user">
                        <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="icon feather icon-settings"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right profile-notification">
                            <div class="pro-head">
                                <img src="assets/images/user/userneutral.png" class="img-radius" alt="User-Profile-Image"/>
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
      <div class="pcoded-wrapper">
        <div class="pcoded-content">
          <div class="pcoded-inner-content">
            {/* <!-- [ breadcrumb ] start --> */}

            {/* <!-- [ breadcrumb ] end --> */}
            <div class="main-body">
              <div class="page-wrapper">
                {/* <!-- [ Main Content ] start --> */}
                <div class="row">
                  {/* <!--[ daily sales section ] start--> */}
                  <div class="col-md-6 col-xl-6">
                    <div class="card daily-sales">
                      <div class="card-block">
                        <h2 class="mb-4 text-center">Create a new User</h2>
                        <div class="row d-flex align-items-center">
                          <div class="col text-center">
                            <button
                              type="button"
                              class="btn btn-primary"
                              title=""
                              data-toggle="tooltip"
                              style={{ fontSize: "2em" }}
                              onClick={() => this.createNewUser()}
                            >
                              create
                            </button>
                          </div>
                        </div>
                        <div class="col text-center">
                          <h3>user info</h3>
                          <h6>user ID :{this.state.userInfo.userId}</h6>
                          <h6>password : {this.state.userInfo.userPassword}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-xl-6">
                    <div class="card Monthly-sales">
                      <div class="card-block">
                        <h2 class="mb-6 text-center">Change user password</h2>
                        <div class="col">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span
                                class="input-group-text"
                                id="inputGroup-sizing-default"
                              >
                                ID of the user
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              onChange={(e) => {
                                this.setState({changePasswordUserId:e.target.value});
                              }}
                            />
                          </div>
                        </div>
                        <div class="col d-flex align-items-center mb-3">
                          <div class="col text-center">
                            <button
                              type="button"
                              class="btn btn-warning"
                              title=""
                              data-toggle="tooltip"
                              style={{ fontSize: "1.5em" }}
                              onClick={() => this.modifyUserPassword()}
                            >
                              Change password
                            </button>
                          </div>
                        </div>
                        <div class="col text-center">
                          <h3>new password :{this.state.newPassword}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-xl-6">
                    <div class="card Monthly-sales">
                      <div class="card-block">
                        <h2 class="mb-6 text-center">Manual Feedback Send</h2>
                        <div class="col">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span
                                class="input-group-text"
                                id="inputGroup-sizing-default"
                              >
                                Patient ID
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              value={this.state.userFeed}
                              onChange={(e) => {
                                this.onChangeValueFeeduser(e.target.value);
                              }}
                            />
                          </div>
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span
                                class="input-group-text"
                                id="inputGroup-sizing-default"
                              >
                                Feedback
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              value={this.state.mFeedback}
                              onChange={(e) => {
                                this.onChangeValueFeedtext(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div class="col d-flex align-items-center mb-3">
                          <div class="col text-center">
                            <button
                              type="button"
                              class="btn btn-warning"
                              title=""
                              data-toggle="tooltip"
                              style={{ fontSize: "1.5em" }}
                              onClick={() => this.sendFeedback()}
                            >
                              Send Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-xl-6">
                    <div class="card Monthly-sales">
                      <div class="card-block">
                        <h2 class="mb-6 text-center">Manual Notification Send</h2>
                        <div class="col">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span
                                class="input-group-text"
                                id="inputGroup-sizing-default"
                              >
                                Send To
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              value={this.state.userNotif}
                              onChange={(e) => {
                                this.onChangeValueNotifuser(e.target.value);
                              }}
                            />
                          </div>
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span
                                class="input-group-text"
                                id="inputGroup-sizing-default"
                              >
                                Notification
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Default"
                              aria-describedby="inputGroup-sizing-default"
                              value={this.state.mNotification}
                              onChange={(e) => {
                                this.onChangeValueNotiftext(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div class="col d-flex align-items-center mb-3">
                          <div class="col text-center">
                            <button
                              type="button"
                              class="btn btn-warning"
                              title=""
                              data-toggle="tooltip"
                              style={{ fontSize: "1.5em" }}
                              onClick={() => this.sendnotif()}
                            >
                              Push Notification
                            </button>
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
    </>
  );
};
}