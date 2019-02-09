import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Label, Input, FormText } from 'reactstrap';

import { rebase } from './index';


export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      loading: true,
      name: "",
      body: "",
    }

    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.noteID);
  }

  fetchData(id){
    rebase.get('notes/' + id, {
      context: this,
    }).then((note) =>
        this.setState({name: note.name, body: note.body, loading:false}));
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.noteID!==props.match.params.noteID){
      this.setState({loading:true});
      this.fetchData(props.match.params.noteID);
    }
  }

  submit(){
    this.setState({saving:true});
    rebase.updateDoc('/notes/'+this.props.match.params.noteID, {name:this.state.name, body:this.state.body})
    .then(() => {
      this.setState({
        saving:false,
      });
    });
  }

  remove(){
    if (window.confirm("Chcete zmazať túto poznámku?")) {
      rebase.removeDoc('/notes/'+this.props.match.params.noteID)
      .then(() => {
        this.props.history.goBack();
      });
    }
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

          <Button disabled={this.state.loading || this.state.saving} color="primary" onClick={this.submit.bind(this)} >{!this.state.saving ? "Save":"Saving..."}</Button>
          <Button disabled={this.state.loading || this.state.saving} color="danger" onClick={this.remove.bind(this)} >Delete</Button>
      </div>
    );
  }
}
