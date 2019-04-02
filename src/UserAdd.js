import React, { Component } from 'react';
import { Button, Progress, FormGroup, Label, Input, Alert} from 'reactstrap';

import {isEmail} from './helperFunctions';

import { rebase } from './index';
import firebase from 'firebase';

import store from "./redux/Store";
import { loginUser } from "./redux/actions/index";

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      active: false,
      editUsers: false,
      showContent: false,
      editContent: false,
      validMail: false,

      value: 100,
    }
    this.register.bind(this);
  }

  register(){
    if (this.state.username.length === 0
    || this.state.email.length === 0
    || !this.state.validMail
    || this.state.pass1.length <= 5
    || this.state.pass2.length <= 5
    || this.state.pass1 !== this.state.pass2){
      return;
    }
    this.setState({value: 0});

      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass1)
      .then((user) => {

          let id = firebase.auth().currentUser.uid;

          rebase.addToCollection(`users`, {username: this.state.username, active: this.state.active, email: this.state.email, editUsers: this.state.editUsers, showContent: this.state.showContent, editContent: this.state.editContent}
          , id).then((data) => {
            this.setState({
              username: "",
              email: "",
              pass1: "",
              pass2: "",
              active: false,
              showContent: false,
              editContent: false,
              validMail: false,
              value: 100,
            });
            this.props.history.push(`/users/${id}`);
          });
      });
  }

  render(){
    if (store.getState().user.username === "Log in" || !store.getState().user.editUsers){
      return(
        <div>
          K tejto stránke nemáte povolený prístup.
        </div>
      );
    }
    return (
      <div>
        <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

        <h2>Add new user</h2>

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

          {(this.state.validMail || this.state.email.length === 0)
            &&
              <Input
                id="email"
                placeholder="email"
                value={this.state.email}
                onChange={(e) =>
                  this.setState({
                    email: e.target.value,
                    validMail: isEmail(e.target.value)})}
                />
            }

          { (!this.state.validMail && this.state.email.length > 0)
          &&
            <Input
              id="email"
              placeholder="email"
              value={this.state.email}
              invalid
              onChange={(e) =>
                this.setState({
                  email: e.target.value,
                  validMail: isEmail(e.target.value)})}
              />
          }

          <Input
            id="password"
            placeholder="Password"
            type="password"
            value={this.state.pass1}
            onChange={(e) =>
              this.setState({pass1: e.target.value})}
          />

          <Input
            id="password"
            placeholder="Repeat password"
            type="password"
            value={this.state.pass2}
            onChange={(e) =>
              this.setState({pass2: e.target.value})}
          />
        { (this.state.pass1.length <= 5)
            &&
            <Alert color="danger">
                    Heslo musí mať aspoň 6 znakov.
            </Alert>

          }

          { (this.state.pass1 !== this.state.pass2)
            &&
            <Alert color="danger">
                    Zadané heslá sa nezhodujú.
            </Alert>

          }
        </FormGroup>

        <Button color="success" onClick={() => this.register()}> Save </Button>
      </div>
    );
  }
}
