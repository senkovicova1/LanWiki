import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Alert, ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import store from "./redux/Store";

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
    }

    if (this.props.match.params.userID === 'add'){
      return;
    }

    this.submit.bind(this);
    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.userID);
  }

  componentWillMount(){
    if (store.getState().user.username === "Log in"){
      this.props.history.push(`/notes/all`);
    }
  }

  fetchData(id){
    if (id === 'add'){
      console.log(true);
      return;
    }
    rebase.get('users/' + id, {
      context: this,
    }).then((user) =>
      this.setState({username: user.username, email: user.email, active: user.active}));
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.userID!==props.match.params.userID){
      this.setState({loading:true});
      this.fetchData(props.match.params.userID);
    }
  }

  submit(){
    this.setState({saving:true});
    let data = {username:this.state.username, email:this.state.email, active: this.state.active};
    if (this.state.pass1 === this.state.pass2 && this.state.pass1 !== ""){
      data = {username:this.state.username, email:this.state.email, password: this.state.pass1, active: this.state.active};
    }

    rebase.updateDoc('/users/'+this.props.match.params.userID, data)
    .then(() => {
      this.setState({
        saving:false,
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
        <h2>Edit user</h2>
        <FormGroup>
          <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.active}
              onChange={(e) => this.setState({active: e.target.chec})}
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
          <Input
            id="email"
            placeholder="email"
            value={this.state.email}
            onChange={(e) =>
              this.setState({email: e.target.value})}
          />

          <Input
            id="password"
            placeholder="Password"
            value={this.state.pass1}
            onChange={(e) =>
              this.setState({pass1: e.target.value})}
          />

          <Input
            id="password"
            placeholder="Repeat password"
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
        </FormGroup>

        <Button color="success"> Save </Button>
        <Button color="danger">      <FontAwesomeIcon icon="trash" /></Button>
</div>
    );
  }
}
