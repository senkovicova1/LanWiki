import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, InputGroup, ListGroup, ListGroupItem, Table  } from 'reactstrap';

import {hightlightText} from './helperFunctions';

import { rebase } from './index';


export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      name: "",
      body: "",
      public: false,
      active: false,
      read: [],
      write: [],
      users: [],
      search: "",
    }

    this.addUser.bind(this);
    this.changeUserRead.bind(this);
    this.changeUserWrite.bind(this);
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/users', {
      context: this,
      withIds: true,
      then: users=> this.setState({users})
    });
  }

  submit(){
    this.setState({saving:true});
    let newRead = this.state.read.map(user => user.id);
    let newWrite = this.state.write.map(user => user.id);
    rebase.addToCollection('/tags', {name:this.state.name, body:this.state.body, read: newRead, write: newWrite, public: this.state.public, active: this.state.active})
    .then(() => {
      this.setState({
        saving:false,
        name: "",
        body: "",
        users: "",
        read: [],
        write: [],
        public: false,
        active: false,
      });
    });
  }

  addUser(user){
    let newRead = [...this.state.read, user];
    let newWrite = [...this.state.write, user];
    this.setState({
      search: "",
      read: newRead,
      write: newWrite,
    })
  }

  changeUserRead(user){
    let newWrite = this.state.write.filter(u => u !== user);
    let newRead = this.state.read.filter(u => u !== user);
    this.setState({
      write: newWrite,
      read: newRead,
    });
  }

  changeUserWrite(user){
    if (this.state.write.includes(user)){
      console.log("ha");
      let newWrite = this.state.write.filter(u => u !== user);
      this.setState({
        write: newWrite,
      });
    } else {
      console.log("hah");
      let newWrite = [...this.state.write, user];
      this.setState({
        write: newWrite,
      });
    }
  }

  render(){
    return (
      <div >
        <h2>Add tag</h2>

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


          <FormGroup>
            <Label htmlFor="name">Názov</Label>
            <Input id="name" placeholder="Názov" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
          </FormGroup>


          <FormGroup>
            <Label htmlFor="body">Popis</Label>
            <Input type="textarea" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
          </FormGroup>


          <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.public}
              onChange={(e) => this.setState({public: e.target.checked})}
              />{' '}
            Public
          </Label>
        </FormGroup>

        {!this.state.public
          &&
            <div>
              <InputGroup>
                <Input placeholder="Search" value={this.state.search} onChange={(e) => this.setState({search: e.target.value})}/>
              </InputGroup>

                { this.state.search !== ""
                  &&
                    <ListGroup>
                      {
                          this.state.users.filter((item) => item.username.toLowerCase().includes(this.state.search.toLowerCase()))
                          .map(user => (
                            <ListGroupItem
                              active={false}
                              onClick={() => this.addUser(user)}
                              action
                              key={user.id}
                              >{hightlightText(user.username, this.state.search, '#00FF04')}</ListGroupItem>
                          ))
                      }
                    </ListGroup>
                }

              {  this.state.read.length > 0
                &&
                <Table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Read</th>
                      <th>Write</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.read.map(user =>
                        <tr>
                          <td>{user.username}</td>
                          <td>
                              <Input
                              type="checkbox"
                              checked={true}
                              onChange={(e) => this.changeUserRead(user)}
                              />
                          </td>
                          <td>
                              <Input
                              type="checkbox"
                              checked={this.state.write.includes(user)}
                              onChange={(e) => this.changeUserWrite(user)}
                              />
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
              }
            </div>
          }

          <Button disabled={this.state.saving} color="success" onClick={this.submit.bind(this)} >{!this.state.saving ? "Add":"Adding..."}</Button>
      </div>
    );
  }
}
