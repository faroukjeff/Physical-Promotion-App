import React from 'react';
import {answers} from './GlobalAnswer'
import {date} from './GlobalAnswer'
import datefns from "date-fns/isSameWeek";


export default class openanscomponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      question: this.props.formdata.text,//data from parent
      fid: this.props.formdata.fid,//data from parent
      qid: this.props.formdata.qid,//data from parent
      type: this.props.formdata.type,//data from parent
      inputtype:"text",
    };
    }

    componentDidMount(){
      if(this.state.type === "date"){
        this.setState({inputtype:"date"})
      }
      if(this.state.type === "num"){
        this.setState({inputtype:"number"})
      }
    }
    
    handleChange = event => {
      if(this.state.type != "date"){
        const index = this.state.fid + "-" + this.state.qid
        answers[index] = {[this.state.qid] : event.target.value};
      }else{
          if(datefns(Date.parse(event.target.value),Date.now(),{weekStartsOn: 1})){
          date["date"] = event.target.value;
        }else{
          alert("Date should be from the same week")
          event.target.value=""
        }
        
      }
    }


  render() {
    return (
    <div>
      <div class="card">
        <div class="col-sm-12">
          <div class="card-header">
            <div class="row">
              <div class="col-md-10">
                <div class="form-group">
                    <h5>{this.state.question}</h5>
                    <hr/>
                    <input
                      id="openans"
                      type={this.state.inputtype}
                      class="form-control"
                      placeholder="Answer here"
                      onChange={this.handleChange}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
  }

}