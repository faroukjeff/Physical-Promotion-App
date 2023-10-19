import React from "react";
import axios from "axios";
import { serverUrl } from '../../apis/serverUrl';

export default class Notifications extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notifies:[],
    }
  }
  componentDidUpdate(){
    axios.post(serverUrl + '/notifies/get', {
      studyId: this.props.user_id
    }).then(res => {
      if(res.data){
        this.setState({notifies : res.data.Notifications})
      }
    })
  }
  render(){
    return(
    this.state.notifies && <ul>
      {this.state.notifies.map(notife => {
        return <li class="notification">
        <div class="media-body">
          <p><i class="fas fa-circle text-c-green f-10 m-r-15"></i>
            {(new Date(notife.time)).getFullYear() + '/'+(new Date(notife.time)).getMonth()+'/'+(new Date(notife.time)).getDate() + "-" + (new Date(notife.time)).getHours()+":"+(new Date(notife.time)).getMinutes()}</p>
          <p style={{textIndent : "25px"}}>{notife.title}</p>
        </div>
        </li>
          
      })}
    </ul>
  )
}  
}