import React from "react";
import authService from "../login/auth.service";
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import Notifications from "../Notifications/Notifications";
import axios from "axios";
import { serverUrl } from "../../apis/serverUrl";



export default class Usergraph extends React.Component {
  //Constructor declaration
  constructor(props) {
    super(props);
    this.state = {
      JWT_token: JSON.parse(localStorage.getItem("user")),
      user_id: "",
      notificonon:"icon feather icon-bell-off",
      charts :{
          baseUrl : "https://charts.mongodb.com/charts-project-0-vcokg",
          data:{
          c1:{
              chartId:"04fd61b3-8cdd-4753-8a3c-7403dffd3c27",
              height:"400px",
              width:"400px",
              renderId:"userchart"
          },
          c2:{
            chartId:"5aedf577-a65f-4afe-94d3-c58b8750cbd2",
            height:"400px",
            width:"400px",
            renderId:"userchart1"
          },
          c3:{
            chartId:"6aeaf93e-7ff4-4cde-bcab-4d43a923f9fb",
            height:"400px",
            width:"400px",
            renderId:"userchart2"
          },
          c4:{
            chartId:"9916f392-80da-453f-a79e-14e32b167fea",
            height:"400px",
            width:"400px",
            renderId:"userchart3"
          },
          c5:{
            chartId:"2d6fb949-3c0f-42b9-b9da-159147606aa2",
            height:"400px",
            width:"400px",
            renderId:"userchart4"
          },
          c6:{
            chartId:"43d0495a-c610-4e81-abe4-f6a9001a72a0",
            height:"400px",
            width:"400px",
            renderId:"userchart5"
          }
        }
      }
    };
  }
  
  //if component is redenred, the following is executed
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
      for(const chart in this.state.charts.data){
        this.renderChart(this.state.charts.baseUrl,this.state.charts.data[chart].chartId
            ,this.state.charts.data[chart].height,this.state.charts.data[chart].width,
            this.state.charts.data[chart].renderId)
    }
      if(value.role !== "patient"){
        const { history } = this.props;
        history.push({pathname: '/login'});
        window.location.reload();
        alert("You are not a Patient")
      }
      axios.post(serverUrl + '/notifies/get', {
        studyId: this.state.user_id
      }).then((data) =>{
        if(Object.keys(data.data.Notifications).length !== 0){
          this.setState({notificonon:"icon feather icon-bell"})
        }else{
          this.setState({notificonon:"icon feather icon-bell-off"})
        }
      })
    })}catch (e){
      const { history } = this.props;
      history.push({pathname: '/login', search:"?redirecttologin" });
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
    axios.get(serverUrl +
        "/notifies/clearall?studyId=" + this.state.user_id 
      )
    window.location.reload();
  };

 renderChart(baseUrl,chartId,height,width,renderId) {
    const sdk = new ChartsEmbedSDK({
      baseUrl: baseUrl,
      getUserToken: function() {
          const token = JSON.parse(localStorage.getItem("user"));
        return token.accessToken
      }
    });
    const chart = sdk.createChart({ 
        chartId: chartId,
        height:height,
        width:width,
        filter: { "user_id": this.state.user_id }
     });
    chart.render(document.getElementById(renderId));
  }

  

  render() {
    return (
    <body>
    <div class="loader-bg">
        <div class="loader-track">
            <div class="loader-fill"></div>
        </div>
    </div>
    <nav class="pcoded-navbar" style={{left:0}}>
        <div class="navbar-wrapper">
            <div class="navbar-brand header-logo">
                <a href="/home" class="b-brand">
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
                    <li class="nav-item"><a href="" class="nav-link "><span class="pcoded-micon"><i class="feather icon-pie-chart"></i></span><span class="pcoded-mtext">Data Visualization</span></a></li>
                </ul>
            </div>
        </div>
    </nav>

    <header class="navbar pcoded-header navbar-expand-lg navbar-light">
        <div class="m-header">
            <a class="mobile-menu" id="mobile-collapse1" href="javascript:"><span></span></a>
            <a href="home" class="b-brand">
                   <div class="b-bg">
                    <img src="favicon.png" width="60" height="60"></img>
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
                                <li class="notification">
                                    <div class="media">
                                    <div class="">
                                            <Notifications user_id={this.state.user_id}/>
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
    
      <div class="pcoded-main-container">
            <div class="grid-container" style={{display: "grid",gridTemplateColumns: "1fr 1fr",gridGap: "15px",}}>
                <div class="grid-child">
                    <chart id="userchart"></chart>
                </div>
                <div class="grid-child">
                    <chart id="userchart1"></chart>
                </div>
            </div>
            <br></br>
            <br></br>
            <div class="grid-container" style={{display: "grid",gridTemplateColumns: "1fr 1fr",gridGap: "15px",}}>
                <div class="grid-child">
                    <chart id="userchart2"></chart>
                </div>
                <div class="grid-child">
                    <chart id="userchart3"></chart>
                </div>
            </div>
            <br></br>
            <br></br>
            <div class="grid-container" style={{display: "grid",gridTemplateColumns: "1fr 1fr",gridGap: "15px",}}>
                <div class="grid-child">
                    <chart id="userchart4"></chart>
                </div>
                <div class="grid-child">
                    <chart id="userchart5"></chart>
                </div>
            </div>
        </div>


    
    </body>
      
    );
  }
}
