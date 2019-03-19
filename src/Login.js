import React, { Component } from 'react';
import { Button, FormGroup, Input, Alert } from 'reactstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

//import store from "./redux/Store";
//import { loginUser } from "./redux/actions/index";

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      pass: "",
      invalid: false,
      users: []
    }

    this.submit.bind(this);
    this.fetch.bind(this);
    this.fetch();
  }

  fetch(){
    rebase.get('users', {
      context: this,
      withIds: true,
    }).then((users) => this.setState({users}))
  }

  submit(){
    let user = this.state.users.filter(u => u.email === this.state.email && u.password === this.state.pass);

    if (user.length === 0){
      this.setState({
        invalid: true,
      });
    } else {
    //  store.dispatch(loginUser(user[0]));
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

        <Button color="success" onClick={() => this.submit()}> Save </Button>
        {"                        "}
        <Button color="secondary" onClick={() => this.props.cancel()}> Cancel </Button>
      </div>
    );
  }
}
