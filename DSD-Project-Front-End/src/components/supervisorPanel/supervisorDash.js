import React from "react";
import authService from "../login/auth.service";
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import axios from "axios";
import { serverUrl } from '../../apis/serverUrl';



export default class Superdash extends React.Component {
  //Constructor declaration
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
              chartId:"4a50848f-bdae-428a-9331-ac59c334814b",
              height:"400px",
              width:"400px",
              renderId:"userchart",
              filter:{},
          },
          c2:{
            chartId:"1766a63b-2de5-4518-9ca4-d16550e6ef63",
            height:"400px",
            width:"400px",
            renderId:"feedbackchart",
            filter:{},
          },
          c3:{
            chartId:"5dd3776a-879a-48d9-82ef-2bb91bd58d64",
            height:"400px",
            width:"400px",
            renderId:"answerschart",
            filter:{},
          },
          c4:{
            chartId:"79317140-d679-47dd-8cd6-d6520edaf721",
            height:"400px",
            width:"400px",
            renderId:"hitchart",
            filter:{},
          },
          c5:{
            chartId:"351a166b-99a5-4e81-baae-bebfd20f525b",
            height:"400px",
            width:"400px",
            renderId:"borgchart",
            filter:{},
          },
          c6:{
            chartId:"471fa0d2-b40d-4509-ac18-8d0cd82e5304",
            height:"400px",
            width:"400px",
            renderId:"chart6",
            filter:{},
          },
          c7:{
            chartId:"4bf5ae23-e215-481a-9fda-551f22511073",
            height:"400px",
            width:"400px",
            renderId:"chart7",
            filter:{},
          },
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

    axios.get(serverUrl+"/getAllClientsId").then((response) =>{
      this.setState({patients:response.data})
    })

  }

  componentDidMount(){
    for(const chart in this.state.charts.data){
        this.renderChart(this.state.charts.baseUrl,this.state.charts.data[chart].chartId
            ,this.state.charts.data[chart].height,this.state.charts.data[chart].width,
            this.state.charts.data[chart].renderId,this.state.charts.data[chart].filter)
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

  handleselectc6 = (event) => {
    this.renderChart(this.state.charts.baseUrl,this.state.charts.data.c6.chartId
    ,this.state.charts.data.c6.height,this.state.charts.data.c6.width,
    this.state.charts.data.c6.renderId,{user_id : event.target.value})
  }

  handleselectc7 = (event) => {
    this.renderChart(this.state.charts.baseUrl,this.state.charts.data.c7.chartId
    ,this.state.charts.data.c7.height,this.state.charts.data.c7.width,
    this.state.charts.data.c7.renderId,{user_id : event.target.value})
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
                <li class="nav-item active">
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
    <div class="grid-container" style={{display: "grid",gridTemplateColumns: "1fr 1fr 1fr",gridGap: "0px",}}>
        <div class="grid-child">
        <chart id="userchart"></chart>
        </div>
        <div class="grid-child">
        <chart id="feedbackchart"></chart>
        </div>
        <div class="grid-child">
        <chart id="answerschart"></chart>
        </div>
    </div>
    <br></br>
    <br></br>
    <div class="grid-container" style={{display: "grid",gridTemplateColumns: "1fr 1fr 1fr",gridGap: "0px",}}>
      <div class="grid-child">
        <chart id="hitchart"></chart>
      </div>
      <div class="grid-child">
        <chart id="borgchart"></chart>
      </div>
      <div class="grid-child">
      <select class="form-control" onChange={this.handleselectc6}>
        {this.state.patients.map((type, i) => (
          <option value={type}>{type}</option>
        ))}
      </select>
        <chart id="chart6"></chart>
      </div>
      </div>

      <br></br>
    <br></br>
    <div class="grid-container" style={{display: "grid",gridTemplateColumns: "1fr 1fr 1fr",gridGap: "0px",}}>
      <div class="grid-child">
      <select class="form-control" onChange={this.handleselectc7}>
        {this.state.patients.map((type, i) => (
          <option value={type}>{type}</option>
        ))}
      </select>
        <chart id="chart7"></chart>
      </div>
      </div>

    </div>
    </body>
      
    );
  }
}
