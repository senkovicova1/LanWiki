import React, { Component } from 'react';
import { Button, FormGroup, Progress, Label, Input, Alert, } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import store from "./redux/Store";
import { loginUser } from "./redux/actions/index";

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      loading: true,

      username: "",
      email: "",
      pass1: "",
      pass2: "",
      active: false,
      showContent: false,
      editUsers: false,
      editContent: false,

      value: 0,
    }

    this.submit.bind(this);
    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.userID);
  }


  fetchData(id){
    if (id === 'add'){
      return;
    }
    rebase.get('users/' + id, {
      context: this,
    }).then((user) =>
      this.setState({
        username: user.username,
        email: user.email,
        active: user.active,
        editUsers: user.editUsers,
        showContent: user.showContent,
        editContent: user.editContent,
        value: 100
      }));
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.userID!==props.match.params.userID){
      this.setState({lvalue: 0});
      this.fetchData(props.match.params.userID);
    }
  }

  submit(){
    this.setState({value: 0});
    let data = {username:this.state.username, email:this.state.email, active: this.state.active, editUsers: this.state.editUsers, showContent: this.state.showContent, editContent: this.state.editContent,};

    rebase.updateDoc('/users/'+this.props.match.params.userID, data)
    .then(() => {
      if (this.props.match.params.userID === store.getState().user.id){
        let user = {
          username: store.getState().user.username,
          id: store.getState().user.id,
          email: store.getState().user.email,
          editUsers: this.state.editUsers,
          editContent: this.state.editContent,
          showContent: this.state.showContent,
        }
        store.dispatch(loginUser(user));
      }
      this.setState({
        value: 100,
      });
    });
  }

  remove(){
    if (window.confirm("Chcete zmazať tohto používateľa?")) {
      rebase.removeDoc('/users/'+this.props.match.params.userID)
      .then(() => {
        this.props.history.goBack();
      });
    }
  }



  render(){
    return (
      <div>
        <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>
        <h2>Edit user</h2>
        <FormGroup>
          <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.active}
              onChange={(e) => this.setState({active: e.target.checked})}
              />{' '}
            Active
          </Label>
        </FormGroup>

          <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.editUsers}
              onChange={(e) => this.setState({editUsers: e.target.checked})}
              />{' '}
            Edit users
          </Label>
        </FormGroup>

          <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.showContent}
              onChange={(e) => this.setState({showContent: e.target.checked})}
              />{' '}
            See all tags and notes
          </Label>
        </FormGroup>

          <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.editContent}
              onChange={(e) => this.setState({editContent: e.target.checked})}
              />{' '}
            Edit all tags and notes
          </Label>
        </FormGroup>

          <Input
            id="username"
            placeholder="Username"
            value={this.state.username}
            onChange={(e) =>
              this.setState({username: e.target.value})}
          />
          <Input
            id="email"
            placeholder="email"
            value={this.state.email}
            onChange={(e) =>
              this.setState({email: e.target.value})}
          />

        </FormGroup>
        <Button color="success" onClick={() => this.submit()}> Save </Button>

        </div>
    );
  }
}
