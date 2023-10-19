import React from 'react';
import {answers} from './GlobalAnswer'



export default class mcqcomponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      question: this.props.formdata.text,//data from parent
      choices: this.props.formdata.choices,//data from parent
      fid: this.props.formdata.fid,//data from parent
      qid: this.props.formdata.qid,//data from parent
    };
    }

    onChangeValue = event =>{
      const index = this.state.fid + "-" + this.state.qid//unique id for storing answer
      answers[index] = {[this.state.qid] : event.target.value};//storing in global object
    }

  render() {
    return (//Classic & typical html radio button with map to render multiple stuff from json
      <html lang="en">
        <body>
            <div class="card" >
                <div class="card-header" >
                        <div class="col-md-6">
                            <h5>{this.state.question}</h5>
                            <hr/>
                            {this.state.choices.map((type, i) => (
                                <div className='div-brand' onChange={this.onChangeValue}>
                                  <div class="custom-control custom-radio">
                                    <input 
                                            type="radio"
                                            id={type+i+this.props.formdata.text}
                                            name={this.props.formdata.text}
                                            class="custom-control-input"
                                            value={type}
                                            />
                                    <label class="custom-control-label" for={type+i+this.props.formdata.text}>{type}</label>
                                  </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </body>
    </html>
    )
  }

}