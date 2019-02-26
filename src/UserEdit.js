import React, { Component } from 'react';
import { Button, FormGroup, Input, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText, ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import CKEditor from 'ckeditor4-react';

import PictureUpload from './PictureUpload';

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      fname: "",
      lname: "",
      email: "",
      pass1: "",
      pass2: "",

      users: [],
    }

    this.remove.bind(this);
    this.changeName.bind(this);
    this.submit.bind(this);
    this.editUser.bind(this);
    this.fetchData.bind(this);
    this.fetchData();
  }

  fetchData(){
    rebase.get('users', {
      context: this,
      asArrat: true,
      withIds: true,
    }).then((users) => {
      this.setState({
        users
      });
    });

  }


  submit(){
    this.setState({saving:true});
    rebase.updateDoc('/notes/'+this.props.match.params.noteID, {name:this.state.name, body:this.state.body, tags: this.state.chosenTags})
    .then(() => {
      this.setState({
        saving:false,
        timeout: null,
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

  changeName(value, data){
    switch (value) {
      case 'fname':
        this.setState({fname: data});
        break;
      case 'lname':
        this.setState({lname: data});
        break;
      case 'email':
        this.setState({email: data});
        break;
      case 'pass1':
        this.setState({pass1: data});
        break;
      default:
        this.setState({pass2: data});
        break;
    }

  }

  editUser(user){
    console.log("here");
    this.setState({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      pass1: user.password,
      pass2: "",
    });
  }

  render(){
    return (
      <div className="row">
        <div className='flex-1-copy'>
        <ListGroup >
              {
                this.state.users.map(user =>
                  <ListGroupItem key={user.key} onClick={() => this.editUser(user)}>{`${user.fname} ${user.lname}`} </ListGroupItem>
                )
              }

        </ListGroup>
      </div>
      <div className='flex-2'>
          <FormGroup>
              <Input
                id="fname"
                placeholder="Názov"
                value={this.state.fname}
                onChange={(e) => this.changeName("fname", e.target.value)}
              />


                <Input
                  id="lname"
                  placeholder="Password"
                  value={this.state.lname}
                  onChange={(e) => this.changeName("lname", e.target.value)}
                />

                <Input
                  id="email"
                  placeholder="Password"
                  value={this.state.email}
                  onChange={(e) => this.changeName("email", e.target.value)}
                />
            <Input
              id="pass1"
              placeholder="Password"
              value={this.state.pass1}
              onChange={(e) => this.changeName("pass1", e.target.value)}
            />

            <Input
              id="pass2"
              placeholder="Repeat password"
              value={this.state.pass2}
              onChange={(e) => this.changeName("pass2", e.target.value)}
            />

          <Button color="success"> Save </Button>
          <Button color="danger">      <FontAwesomeIcon icon="trash" /></Button>

          </FormGroup>
</div>

      </div>
    );
  }
}
