import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Alert, ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      validMail: false,
    }
    this.submit.bind(this);
    this.register.bind(this);
  }
  componentWillMount(){
    if (store.getState().user.username === "Log in"){
      this.props.history.push(`/notes/all`);
    }
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

      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass1)
      .then((user) => {

          store.dispatch(loginUser({user: {username: this.state.username, active: this.state.active, email: this.state.email}}));

          let id = firebase.auth().currentUser.uid;

          rebase.addToCollection(`users`, {username: this.state.username, active: this.state.active, email: this.state.email}
          , id).then((data) => {
            this.setState({
              username: "",
              email: "",
              pass1: "",
              pass2: "",
              active: false,
              validMail: false,
            });
          });
      });
  }

  submit(){
    if (this.state.pass1 === this.state.pass2 && this.state.pass1 !== ""){
      let data = {username:this.state.username, email:this.state.email, password: this.state.pass1, active: this.state.active};
      rebase.addToCollection('/users', data)
      .then(() => {
        this.setState({
          username: "",
          email: "",
          pass1: "",
          pass2: "",
          active: false,
          validMail: false,
        });
      });
    }
  }

  render(){
    return (
      <div>
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
