import React, {Component} from 'react';
import { Collapse, Table, Dropdown, Navbar, NavbarToggler, Input, FormGroup, Label, NavbarBrand, Button, Nav,Popover, PopoverHeader, PopoverBody,  Col, Row, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {Route} from 'react-router-dom';

import Sidebar from './Sidebar';
import ListNotes from './ListNotes';
import TagAdd from './TagAdd';
import TagEdit from './TagEdit';
import ListUsers from './ListUsers';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';

import { rebase } from './index';
import store from "./redux/Store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Navigation extends Component {
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
    this.fetch.bind(this);
    this.fetch();
  }

  fetch(){

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
              <Button id="items" type="button">
                 Items
               </Button>
               <div  >
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

            </Navbar>
          </Col>
          }
        </div>

        <div className="row">
          <Route path='/' component={Sidebar} />
          <div className="flex">

            <Route exact path='/notes/:tagID/:noteID' component={ListNotes} />
            <Route exact path='/notes/:tagID' component={ListNotes} />
            <Route exact path='/notes' component={ListNotes} />

            <Route exact path='/tags/add' component={TagAdd} />
            <Route exact path='/tags/:tagID' component={TagEdit} />

            <Route exact path='/users/:userID' component={ListUsers} />
            <Route exact path='/users' component={ListUsers} />

          </div>
        </div>

      </div>
    )
  }
}
/*
<Dropdown  isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} inNavbar>
  <DropdownToggle  caret>
    Items
  </DropdownToggle>
  <DropdownMenu right>
    <DropdownItem>

    </DropdownItem>
  </DropdownMenu>
</Dropdown>

*/
