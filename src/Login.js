import React, { Component } from 'react';
import { Button, FormGroup, Input, Alert } from 'reactstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';
import firebase from 'firebase';

import store from "./redux/Store";
import { loginUser } from "./redux/actions/index";

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      pass: "",
      invalid: false,
      users: [],
    }

    this.submit.bind(this);
    this.login.bind(this);
    this.fetch.bind(this);
    this.fetch();
  }

  login(){
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
    .then((res)=>{

      let id = firebase.auth().currentUser.uid;
      let user = this.state.users.filter(u => u.id === id)[0];
      console.log(user);
      store.dispatch(loginUser(user));

      if (store.getState().user !== null){
        this.props.logged();
      }
    }).catch(error=>{console.log(error)});
  }

  fetch(){
    rebase.get('users', {
      context: this,
      withIds: true,
    }).then((users) =>
    this.setState({users}));
  }

  submit(){
    let user = this.state.users.filter(u => u.email === this.state.email && u.password === this.state.pass);

    if (user.length === 0){
      this.setState({
        invalid: true,
      });
    } else {
      store.dispatch(loginUser(user[0]));
      this.props.logged();
    }
  }

  render(){
    return (
      <div>
        <FormGroup>
            <Input
              id="email"
              placeholder="email"
              value={this.state.email}
              onChange={(e) => this.setState({email: e.target.value})}
            />

          <Input
            id="password"
            placeholder="Password"
            type='password'
            value={this.state.pass}
            onChange={(e) => this.setState({pass: e.target.value})}
          />
        { (this.state.invalid)
            &&
            <Alert color="danger">
                Chybné meno alebo heslo.
            </Alert>
          }
        </FormGroup>

        <Button color="success" onClick={() => this.login()}> Log In </Button>
        {"                        "}
        <Button color="secondary" onClick={() => this.props.cancel()}> Cancel </Button>
      </div>
    );
  }
}
