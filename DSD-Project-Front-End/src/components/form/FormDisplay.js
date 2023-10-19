import React from "react";
import axios from "axios";
import Components from "../../components.js";
import {answers} from "./GlobalAnswer";
import {date} from "./GlobalAnswer";
import authService from "../login/auth.service";
import Notifications  from "../Notifications/Notifications.js";
import { serverUrl } from '../../apis/serverUrl';


export default class Formdisplay extends React.Component {
  //Constructor declaration
  constructor(props) {
    super(props);
    this.state = {
      formid: this.props.formid,
      form: [],
      formtext: "",
      JWT_token: JSON.parse(localStorage.getItem("user")),
      user_id: "",
      formsubmitted: false,
      date:"",
      notificonon:"icon feather icon-bell-off",
      cdata: {
        //this dict holds the components to be rendered along with their data such as questions and mcq choices
        content: { body: [{}] },
      },
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
    const pathname = window.location.pathname.toString().replace("/","")
    decodedJwt.then( (value) =>{
      this.setState({user_id:value.studyId})
      if(value.role != "patient"){
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

      if(pathname==="dailyform"){
        axios.get(serverUrl+"/UserSubmitDaily?user_id=" + this.state.user_id
        ).then( (response) =>{
          const checkres = response.data.checkres
          if (checkres){
            alert("You have already Submitted the Daily Form, you can submit an older one now")
          }
        })
      }else if(pathname === "weeklyform"){
        axios.get(serverUrl +
          "/UserSubmitWeekly?user_id=" + this.state.user_id
        ).then( (response) =>{
          const checkres = response.data.checkres
          if (checkres){
            alert("You have already Submitted the Weekly Form")
          }
        })
      }

    })}catch (e){
      const { history } = this.props;
      history.push({pathname: '/login', search:"?redirecttologin" });
      window.location.reload();
    }

    this.extractquestions();
  }

  //get forms question from API by formid
  async getData() {
    const response = await axios.get(serverUrl +
      "/findformbyid?name=" + this.state.formid
    );
    return await response.data;
  }

  //Parse questions by type and add them to the cdata for dynamic generation(render) of components
  async extractquestions() {
    const data = await this.getData();
    for (const question in data[0].questions) {
      if (
        data[0].questions[question].type === "mcq" ||
        data[0].questions[question].type === "binary"
      ) {
        //check if qst type is mcq
        let choicelist = [];
        let tempdata = {};
        let fdata = this.state.cdata;
        if (data[0].questions[question].type === "mcq") {
          for (const mcq in data[0].questions[question]) {
            if (mcq.substring(0, 3) === "mcq") {
              choicelist.push(data[0].questions[question][mcq]);
            }
          }
        } else {
          choicelist = ["Yes", "No"];
        } //special case for yes/mo qst (type binary in form model)
        tempdata = {
          component: "mcqcomponent",
          formdata: {
            text: data[0].questions[question].text,
            choices: choicelist,
            fid: this.state.formid,
            qid: question,
          },
        };
        fdata.content.body.push(tempdata);
        this.setState({ cdata: fdata }); //add the components to cdata
      } else {
        // if the question is open text
        let tempdata = {};
        let fdata = this.state.cdata;
        tempdata = {
          component: "openanscomponent",
          formdata: {
            text: data[0].questions[question].text,
            fid: this.state.formid,
            qid: question,
            type: data[0].questions[question].type
          },
        };
        fdata.content.body.push(tempdata); //same as previous case
        this.setState({ cdata: fdata }); //same as previous case
      }
    }
  }

  saveformans() {
    //post request to save the users answers
    try{
        axios.post(serverUrl+"/saveform", {
        user_id: this.state.user_id,
        form_id: this.state.formid,
        date:date,
        answers: answers, // this is a global object managed by the questions component       
      })
      this.setState({formsubmitted:true})
      window.scrollTo(0, 0)
      const { history } = this.props;
      history.push("/home");
      window.location.reload();
      alert("Form Submitted Successfully")
  }catch(e){alert("An error occured when submitting the form")}

  }

  handleSave = (event) => {
    //on click action
    event.preventDefault();
    this.saveformans();
  };

  handleclear = (event) => {
    //on click action
    event.preventDefault();
    axios.get(serverUrl +
        "/notifies/clearall?studyId=" + this.state.user_id
      )
    window.location.reload();
  };

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
      // call conponent.js with cdata data to render the questions and the submit button the save the questions like explained before
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

        {this.state.formsubmitted && (
                    <div className="form-group">
                    <div className="alert alert-success" role="alert">
                    Form Submitted Successfully
                    </div>
                    </div>
        )}
        {this.state.cdata.content.body.map((block) => Components(block))}
        <button type="submit" class="btn btn-primary" onClick={this.handleSave}>
          Submit
        </button>
        {/* <button type="submit" class="btn btn-primary" onClick={this.handlelogout}>
          Logout
        </button> */}
      </div>
  </body>
      
    );
  }
}
