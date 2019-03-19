import React, { Component } from 'react';
import { Button, FormGroup, Label, Alert, Input, InputGroup, InputGroupAddon, InputGroupText, ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';


export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      username: "",
     email: "",
     pass1: "",
     pass2: "",
     active: false,
   }
   this.submit.bind(this);
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

       <Button color="success" onClick={() => this.submit()}> Save </Button>
     </div>
   );
 }
}
