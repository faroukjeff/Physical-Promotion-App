import React from "react";
import authService from "../login/auth.service";
import axios from "axios";
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import { serverUrl } from '../../apis/serverUrl';



export default class Answerview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            JWT_token: JSON.parse(localStorage.getItem("user")),
            user_id: "",
            patients : [],
            charts :{
                baseUrl : "https://charts.mongodb.com/charts-project-0-vcokg",
                data:{
                    c1:{
                        chartId:"e2c2472f-7436-4a52-a6bc-e9dee1c2916b",
                        height:"500px",
                        width:"100%",
                        renderId:"dailytable",
                        filter:{},
                    },
                    c2:{
                        chartId:"7a1be839-772a-4af8-a970-cab7e7db7635",
                        height:"500px",
                        width:"100%",
                        renderId:"weeklytable",
                        filter:{},
                    },
                }
            }
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
    
      componentDidMount(){
        axios.get(serverUrl+"/getAllClientsId").then((response) =>{
            this.setState({patients:response.data})
          }).then(() =>{
            
            for(const chart in this.state.charts.data){
                console.log(this.state.patients[0])
                this.renderChart(this.state.charts.baseUrl,this.state.charts.data[chart].chartId
                    ,this.state.charts.data[chart].height,this.state.charts.data[chart].width,
                    this.state.charts.data[chart].renderId,{user_id : this.state.patients[0].toString()})
            }

          })

      }

      handleselectday = (event) => {
        this.renderChart(this.state.charts.baseUrl,this.state.charts.data.c1.chartId
        ,this.state.charts.data.c1.height,this.state.charts.data.c1.width,
        this.state.charts.data.c1.renderId,{user_id : event.target.value})
      }

      handleselectweek = (event) => {
        this.renderChart(this.state.charts.baseUrl,this.state.charts.data.c2.chartId
        ,this.state.charts.data.c2.height,this.state.charts.data.c2.width,
        this.state.charts.data.c2.renderId,{user_id : event.target.value})
      }
    
     renderChart(baseUrl,chartId,height,width,renderId,filter) {
        const sdk = new ChartsEmbedSDK({
          baseUrl: baseUrl,
          getUserToken: function() {
              const token = JSON.parse(localStorage.getItem("user"));
            return token.accessToken
          }
        });
        const chart = sdk.createChart({ chartId: chartId,height:height,width:width,filter:filter });
        chart.render(document.getElementById(renderId));
      }
      handlelogout = (event) => {
        //on click action
        event.preventDefault();
        authService.logout();
        const { history } = this.props;
        history.push("/login");
        window.location.reload();
      };

      render() {
        return (
        <body>
        <nav class="pcoded-navbar navbar-collapsed" style={{ left: 0 }}>
            <div class="navbar-wrapper">
              <div class="navbar-brand header-logo">
                <a href="superdash" class="b-brand">
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
                    <li class="nav-item active">
                      <a href="answerview" class="nav-link ">
                        <span class="pcoded-micon">
                          <i class="feather icon-file-text"></i>
                        </span>
                        <span class="pcoded-mtext">Form Answers</span>
                      </a>
                    </li>
                    <li class="nav-item">
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
                        <img src="favicon.png" width="60" height="60"></img>
                       </div>
                       <span class="b-title">PAP App</span>
                   </a>
            </div>
            <a class="mobile-menu" id="mobile-header" href="javascript:">
                <i class="feather icon-more-horizontal"></i>
            </a>
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

        <div class="pcoded-main-container">
            <select class="form-control" onChange={this.handleselectday}>
            {this.state.patients.map((type, i) => (
            <option value={type}>{type}</option>
            ))}
            </select>
            <chart id="dailytable"></chart>
            <select class="form-control" onChange={this.handleselectweek}>
            {this.state.patients.map((type, i) => (
            <option value={type}>{type}</option>
            ))}
            </select>
            <chart id="weeklytable"></chart>

        </div>
        </body>
          
        );
      }
}