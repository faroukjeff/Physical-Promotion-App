import React from "react";
import {render} from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupervisorPanel from "./components/supervisorPanel/SupervisorPanel";
import Formdisplay from "./components/form/FormDisplay";
import Login from "./components/login/login";
import HomePage from "./components/home/home";
import "./App.css";
import { createBrowserHistory } from "history";
import AuthVerify from "./components/login/auth-verify";
import Supervisordash from "./components/supervisorPanel/supervisorDash";
import Usergraph from "./components/form/userGraphs";
import Answerview from "./components/supervisorPanel/answerView";
import { Profile } from "./components/profile/Profile";
const history = createBrowserHistory();


function App() {

  return (
    <div className="container-fluid mycontainer">
      <BrowserRouter >
        <Routes>
          <Route path="/login" element={<Login history={history}/>} />
          <Route path="/supervisor" element={<SupervisorPanel history={history}/>} />
          <Route path="/" element={<HomePage history={history}/>} />
          <Route path="/dailyform" element={<Formdisplay formid="fid_007" history={history}/>} />
          <Route path="/weeklyform" element={<Formdisplay formid="fid_005" history={history}/>} />
          <Route path="/home" element={<HomePage history={history}/>} />
          <Route path="/superdash" element={<Supervisordash history={history}/>} />
          <Route path="/usergraphs" element={<Usergraph history={history}/>} />
          <Route path="/answerview" element={<Answerview history={history}/>} />
          <Route path="/profile" element={<Profile history={history}/>} />
        </Routes>
      </BrowserRouter>
      <AuthVerify history={history}/>
    </div>
  );
}

export default App;
