import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Label, Input, FormText } from 'reactstrap';

import { rebase } from './index';


export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      name: "",
      body: "",
    }
  }

  submit(){
    this.setState({saving:true});
    rebase.addToCollection('/notes', {name:this.state.name, body:this.state.body})
    .then(() => {
      this.setState({
        saving:false,
        name: "",
        body: "",
      });      
    });
  }

  render(){
    return (
      <div >
          <FormGroup>
            <Label htmlFor="name">Názov</Label>
            <Input id="name" placeholder="Názov" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="body">Text</Label>
            <Input type="textarea" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
          </FormGroup>

          <Button disabled={this.state.saving} color="success" onClick={this.submit.bind(this)} >{!this.state.saving ? "Add":"Adding..."}</Button>
      </div>
    );
  }
}
