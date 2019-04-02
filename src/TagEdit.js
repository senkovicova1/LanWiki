import React, { Component } from 'react';
import { Button, FormGroup, Progress, Label, Input, InputGroup, ListGroup, ListGroupItem, Table } from 'reactstrap';
import {hightlightText} from './helperFunctions';

import { rebase } from './index';
import store from "./redux/Store";

export default class TagEdit extends Component{

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
      firstRead: [],
      firstWrite: [],
      users: [],
      search: "",

      value: 0,
    }

    this.addUser.bind(this);
    this.changeUserRead.bind(this);
    this.changeUserWrite.bind(this);
    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.tagID);
  }

  fetchData(id){
    if (id === 'add'){
      return;
    }
    rebase.get('tags/' + id, {
      context: this,
      withIds: true,
    }).then((tag) =>{
         rebase.get('/users', {
          context: this,
          withIds: true,
          }).then((users) =>
              this.setState({
                name: tag.name,
                body: tag.body,
                read: users.filter(u => tag.read.includes(u.id)),
                write: users.filter(u => tag.write.includes(u.id)),
                active: tag.active,
                public: tag.public,
                users,
                value: 100,
              })
            );
    });
  }

  componentWillMount(){
    //kontrola, ci je user prihlaseny - ak nie je, nezobrazi sa mu edit ale prepne sa na /notes/all

  /*  if (store.getState().user.username === "Log in"){
      this.props.history.push(`/notes/all`);
    }*/
    this.ref = rebase.listenToCollection('/users', {
      context: this,
      withIds: true,
      then: users=> this.setState({
        users,
      })
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.tagID!==props.match.params.tagID){
      this.setState({value: 0});
      this.fetchData(props.match.params.tagID);
    }
  }

  submit(){
    this.setState({value: 0});
    let newRead = this.state.read.map(user => user.id);
    let newWrite = this.state.write.map(user => user.id);
    rebase.updateDoc('/tags/'+this.props.match.params.tagID, {name:this.state.name, body:this.state.body, read: newRead, write: newWrite, public: this.state.public, active: this.state.active})
    .then(() => {
      this.setState({
        value: 100,
      });
    });
  }

  remove(){
    this.setState({value: 0});
    if (window.confirm("Chcete zmazať tento tag?")) {
      rebase.removeDoc('/tags/'+this.props.match.params.tagID)
        .then(() =>
            { rebase.get('/notes', {
                context: this,
                withIds: true,
              })
              .then((notes) =>{
                notes.filter(note => (note.tags.includes(this.props.match.params.tagID)))
                .map(note =>
                    rebase.updateDoc('/notes/'+note.id, {name: note.name, body: note.body, tags: note.tags.filter(item => item !== this.props.match.params.tagID)})
                  );
                this.props.history.push(`/notes/all`);
              });
            });
      };
    this.setState({value: 100});
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
    if (this.props.match.params.tagID !== 'add' && (store.getState().user.username === "Log in" || !store.getState().user.editContent)){
      return(
        <div>
          K tejto stránke nemáte povolený prístupz.
        </div>
      );
    }

    if (this.props.match.params.tagID === 'add'){
      return (<div></div>)
    }

    return (
      <div >
        <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

        <h2>Edit tag</h2>

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
                        <tr key={user.id}>
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

          <Button  color="primary" onClick={this.submit.bind(this)} >{!this.state.saving ? "Save":"Saving..."}</Button>
          <Button  color="danger" onClick={this.remove.bind(this)} >Delete</Button>


      </div>
    );
  }
}
