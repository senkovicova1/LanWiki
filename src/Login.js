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
      pass1: "",
      pass2: "",
      invalid: false,
      users: [],
      errorMessage: "",
      openChange: false,
    }

    this.changePassword.bind(this);
    this.login.bind(this);
    this.fetch.bind(this);
    this.fetch();
  }

  login(){
    let canSignIn = this.state.users.filter(u => u.email === this.state.email)[0].active;

    if (canSignIn){

      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
      .then((res)=>{

        let id = firebase.auth().currentUser.uid;
        let user = this.state.users.filter(u => u.id === id)[0];

        store.dispatch(loginUser(user));

        if (store.getState().user !== null){
          this.props.logged();
        }

      });

    } else {
      this.setState({
        errorMessage: "Tento používateľ nie je aktívny."
      });
    }
  }

  fetch(){
    rebase.get('users', {
      context: this,
      withIds: true,
    }).then((users) =>
    this.setState({users}));
  }

  changePassword(){

    if (this.state.openChange && this.state.pass1 === this.state.pass2 && this.state.pass1.length > 6){

      if (store.getState().user.username === "Log in"){

          firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
          .then((res)=>{

            let id = firebase.auth().currentUser.uid;
            let user = this.state.users.filter(u => u.id === id)[0];

            store.dispatch(loginUser(user));

            var userFBA = firebase.auth().currentUser;

            userFBA.updatePassword(this.state.pass1).then(() => {
              this.props.logged();
            }).catch(function(error) {
              console.log(error.message);
            });

          }).catch((error) => {
      //      var errorCode = error.code;
            let errorMessage = "";
            if (error.code === "auth/user-not-found") {
                errorMessage = "Užívateľ s takýmito prihlasovacími údajmi neexistuje.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Nesprávne staré heslo";
              } else {
                errorMessage = error.message;
              }
            this.setState({
              errorMessage: errorMessage + "aaa",
            });
          });
      }
    }
    else if (!this.state.openChange){
      this.setState({
        openChange: true,
      });
    } else {
      this.setState({
        openChange: false,
      });
    }
}

  render(){
    return (
      <div>
        <FormGroup>
          { (this.state.openChange)
            &&
            <div>
              <h4> Zmena hesla </h4>
              <div> Po úsmepšnej zmene hesla budete automaticky prihlásený.</div>
            </div>
          }

            <Input
              id="email"
              placeholder="email"
              value={this.state.email}
              onChange={(e) => this.setState({email: e.target.value})}
            />

          <Input
            id="password1"
            placeholder={this.state.openChange ? "Staré heslo" : "Helo"}
            type='password'
            value={this.state.pass}
            onChange={(e) => this.setState({pass: e.target.value, errorMessage: null})}
          />

          { (this.state.errorMessage)
            &&
            <Alert color="danger">
                {this.state.errorMessage}
            </Alert>
          }

          { (this.state.openChange)
            &&
            <div>

              <Input
                id="password"
                placeholder="Nové heslo"
                type='password'
                value={this.state.pass1}
                onChange={(e) =>
                  this.setState({pass1: e.target.value})}
              />

              <Input
                id="password2"
                placeholder="Prepíšte nové heslo"
                type='password'
                value={this.state.pass2}
                onChange={(e) =>
                  this.setState({pass2: e.target.value})}
              />

              { (this.state.pass1 !== this.state.pass2)
                &&
                <Alert color="danger">
                        Zadané heslá sa nezhodujú.
                </Alert>
              }

              { (this.state.pass1 === this.state.pass2 && this.state.pass1.length < 6 && this.state.pass1.length > 0)
                &&
                <Alert color="danger">
                        Heslo je príliš krátke.
                </Alert>
              }

            </div>
          }
          {"                        "}
          <Button color="link" onClick={() => this.changePassword()}> Change password </Button>

        </FormGroup>

        <Button color="success" onClick={() => this.login()}> Log In </Button>
        {"                        "}
        <Button color="secondary" onClick={() => this.props.cancel()}> Cancel </Button>
      </div>
    );
  }
}
