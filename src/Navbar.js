import React, {Component} from 'react';
import {Navbar, NavbarBrand, Button, Col} from 'reactstrap';

import { rebase } from './index';
import store from "./redux/Store";

export default class Navibar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchedWord: "",
      items: [],
      newItem: "",

      pointless: 42,
    };

    this.niceDate.bind(this);
    this.addItem.bind(this);
    this.removeItem.bind(this);
    this.changeName.bind(this);
    this.toggle.bind(this);
  }

  componentWillMount(){
    const unsub = store.subscribe(this.handleChange.bind(this));

    this.ref = rebase.listenToCollection('/items', {
      context: this,
      withIds: true,
      then: items=>{this.setState({items, unsubscribe: unsub})},
    });
  }

  addItem(){
    let dateCreated = Date().toLocaleString();
    rebase.addToCollection('items',
    {
      name: this.state.newItem,
      dateCreated: dateCreated,
    }).then((data) =>
      this.setState({
        newItem: "",
      })
    )
  }

  removeItem(id){
    rebase.removeDoc('/items/'+id);
  }

  changeName(id, name){
    rebase.updateDoc('/items/'+id,
    {name: name});

  }

  niceDate(uglyDate){
    if (uglyDate){
      let arr = uglyDate.split(" ");
      let niceDate = arr[2] + " " + arr[1] + " " + arr[3] + "  " + arr[4];
      return niceDate;
    } else {
      return "no date";
    }
  }

  handleChange(){
    this.setState({
      pointless: 43,
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(){
    return(
      <div>
            <div className="row">
              { store.getState().user.username === "Log in"
                &&
              <Col>
                <Navbar color="light" light expand="md">
                  <NavbarBrand href="/">LanWiki</NavbarBrand>
                </Navbar>
              </Col>
              }
              { store.getState().user.username !== "Log in"
                &&
              <Col>
                <Navbar color="light" light expand="md">
                <NavbarBrand href="/">LanWiki</NavbarBrand>
                  <Button id="items" type="button" onClick={() => this.props.history.push(`/cmdb/servers`)}>
                     CMDB
                   </Button>
                </Navbar>
              </Col>
              }
            </div>
        </div>
    )
  }
}
/*

<div>
<Popover placement="bottom" isOpen={this.state.isOpen} target="items" toggle={this.toggle.bind(this)}>
  <PopoverHeader>

  </PopoverHeader>
     <Input placeholder="Search" value={this.state.searchedWord} onChange={(e) => this.setState({searchedWord: e.target.value})}/>
  <PopoverBody >
    <Table>
       <thead>
         <tr>
           <th>Name</th>
           <th>Date created</th>
           <th>Delete</th>
         </tr>
       </thead>
       <tbody>
         {
           this.state.items
           .filter(item => item.name.toLowerCase().includes(this.state.searchedWord.toLowerCase()))
           .map(item =>
           (
             <tr key={item.id}>
               <td><Input id="name" placeholder="Názov" value={item.name} onChange={(e) => this.changeName(item.id, e.target.value)}/></td>
               <td>{this.niceDate(item.dateCreated)}</td>
               <td><FontAwesomeIcon icon="trash" onClick={() => this.removeItem(item.id)}/></td>
             </tr>
             )
           )
         }
       </tbody>
     </Table>

     <FormGroup>
       <Label htmlFor="name">Add new</Label>
       <Row>
         <Col xs="10">
             <Input id="name" placeholder="Name" value={this.state.newItem} onChange={(e) => this.setState({newItem: e.target.value})}/>
         </Col>
         <Col xs="1">
             <Button color="success" onClick={() => this.addItem()}>+</Button>
         </Col>
       </Row>
     </FormGroup>

  </PopoverBody>
</Popover>
</div>


*/
