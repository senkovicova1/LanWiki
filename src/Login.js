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
      email: "",
      pass: "",
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
        </FormGroup>
      </div>
    );
  }
}
