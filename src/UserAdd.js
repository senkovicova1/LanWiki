import React, { Component } from 'react';
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import CKEditor from 'ckeditor4-react';

import PictureUpload from './PictureUpload';

/*import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {stateToHTML} from 'draft-js-export-html';*/
//import MyEditor from './Editor';

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      fname: "",
      lname: "",
      email: "",
      pass1: "",
      pass2: "",
    }
}

  render(){
    return (
      <div>
        <FormGroup>
            <Input
              id="fname"
              placeholder="First name"
              value={this.state.fname}
              onChange={(e) => {
                this.setState({fname: e.target.value});
                this.props.addData("fname",e.target.value);
              }}
            />
            <Input
              id=";name"
              placeholder="Last name"
              value={this.state.lname}
              onChange={(e) => {
                this.setState({lname: e.target.value});
                this.props.addData("lname",e.target.value);
              }}
            />
            <Input
              id="email"
              placeholder="email"
              value={this.state.email}
              onChange={(e) => {
                this.setState({email: e.target.value});
                this.props.addData("email",e.target.value);
              }}
            />

          <Input
            id="password"
            placeholder="Password"
            value={this.state.pass1}
            onChange={(e) => {
              this.setState({pass1: e.target.value});
              this.props.addData("pass1",e.target.value);
            }}
          />

          <Input
            id="password"
            placeholder="Repeat password"
            value={this.state.pass2}
            onChange={(e) => {
              this.setState({pass2: e.target.value});
              this.props.addData("pass2",e.target.value);
            }}
          />
        </FormGroup>
      </div>
    );
  }
}
