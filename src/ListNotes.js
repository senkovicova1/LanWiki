import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Progress, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Row, Col  } from 'reactstrap';
import TimeAgo from 'react-timeago'
import { rebase } from './index';
//import NoteAdd from './NoteAdd';
import NoteEdit from './NoteEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {hightlightText} from './helperFunctions';

import store from "./redux/Store";

export default class ListNotes extends Component{

  constructor(props){
    super(props);

    this.state = {
      notes: [],
      search: "",
      tags: [],

      value: 0,
    }

    this.createNew.bind(this);
    this.compare.bind(this);
  }

  componentWillMount(){
    this.setState({
      value: 0,
    });
    rebase.listenToCollection('/notes', {
      context: this,
      withIds: true,
      then: notes=> this.setState({notes, value: 100})
    });
    rebase.listenToCollection('/tags', {
      context: this,
      withIds: true,
      then: tags=> this.setState({tags, value: 100})
    });
  }

  /*componentWillUnmount(){
    rebase.removeBinding(this.ref1);
    rebase.removeBinding(this.ref2);
  }*/

  createNew(){
    let date = new Date();
    rebase.addToCollection('notes',
    {name: "Untitled",
      tags: (this.props.match.params.tagID !== "all" ? [this.props.match.params.tagID] : []),
      body: "",
      lastUpdated: Date().toLocaleString(),
      dateCreated: Date().toLocaleString()
    })
    .then((note) => {
      this.props.history.push(`/notes/${this.props.match.params.tagID}/${note.id}`);
    });
  }

  compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  render(){

    let NOTES = [];
    let ORDERRED_NOTES = [];
    if (this.state.tags.length > 0) {
      if (store.getState().user.username === "Log in") {
        NOTES = this.state.notes
              .filter((item) => item.name.toLowerCase().includes(this.state.search.toLowerCase()))
              .filter((note) => {
                if (this.props.match.params.tagID === 'all'){
                  let cond1 = this.state.tags.filter(tag => note.tags.length === 0 || (note.tags.includes(tag.id) && tag.public)).length > 0;
                  return cond1;
                }
                  let cond1 = note.tags.includes(this.props.match.params.tagID);
                  let tag = this.state.tags.filter(t => t.id === this.props.match.params.tagID)[0];
                  let cond2 = tag.public;
                  return cond1 && cond2;
               })
       } else {
         if (store.getState().user.showContent){
           NOTES = this.state.notes
                  .filter((item) => item.name.toLowerCase().includes(this.state.search.toLowerCase()))
                  .filter((note) => {
                    if (this.props.match.params.tagID === 'all'){
                      return true;
                    }
                    let cond1 = note.tags.includes(this.props.match.params.tagID);
                    let tag = this.state.tags.filter(t => t.id === this.props.match.params.tagID)[0];
                    let cond2 = note.tags.includes(tag.id) && tag.public;
                    return cond1 || cond2;
                  });
         } else {
           NOTES = this.state.notes
           .filter((item) => item.name.toLowerCase().includes(this.state.search.toLowerCase()))
           .filter((note) => {
             let userID = store.getState().user.id;
             if (this.props.match.params.tagID === 'all'){
               let cond1 = this.state.tags.filter(tag => note.tags.length === 0 || (note.tags.includes(tag.id) && (tag.read.includes(userID) || tag.public))).length > 0;
               return cond1;
             }
             let cond1 = note.tags.includes(this.props.match.params.tagID);
             let tag = this.state.tags.filter(t => t.id === this.props.match.params.tagID)[0];
             let cond2 = tag.public || tag.read.includes(userID);
             return cond1 && cond2;
           });
         }
       }
    //   ORDERRED_NOTES = NOTES.sort(this.compare);
  //     ORDERRED_NOTES = NOTES.sort((a, b) => new Date(b.lastUpdated)- new Date(a.lastUpdated));
       ORDERRED_NOTES = NOTES.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
  //     console.log(NOTES);
  //     console.log(ORDERRED_NOTES);
     }
    return (
      <div className="row">
          <div className='flex-1'>
            <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

            { ORDERRED_NOTES.length > 0
              &&
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <FontAwesomeIcon icon="search" />
                  </InputGroupText>
                </InputGroupAddon>

                <Input placeholder="Search" value={this.state.search} onChange={(e) => this.setState({search: e.target.value})}/>
              </InputGroup>
            }

            <ListGroup>
              {store.getState().user.username !== "Log in"
                &&
              <Button
                color="success"
                onClick={(e) => {
                  e.preventDefault();
                  this.createNew();
                }}
                >New Note +</Button>
            }
              {
                //opravenie chyby vo filtroch - pri kliknuti na vypisanie notes pod nejakym tagom, sa this.state.tags vratilo do podoby [] z konstruktora a kym sa spustil redner() sa nestihol updatovat - ale fun. render pocitala s tym, ze uz tagz obsahuje
                this.state.tags.length > 0
                &&
                  ORDERRED_NOTES.map(note => (
                    <ListGroupItem
                      active={this.props.match.params.noteID ? (this.props.match.params.noteID === note.id) : false}
                      tag="a"
                      href={`/notes/${this.props.match.params.tagID}/` + note.id}
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push(`/notes/${this.props.match.params.tagID}/` + note.id);
                      }}
                      action
                      key={note.id}
                      >
                      <Row>
                        <Col xs="9">{hightlightText(note.name, this.state.search, '#00FF04')}</Col>
                        <Col xs="3"><small style={{color: 'rgb(180, 180, 180)'}}><TimeAgo date={note.lastUpdated} minPeriod={300}/></small></Col>
                      </Row>
                      <Row>
                        <Col><small style={{color: 'rgb(180, 180, 180)'}}>{this.state.tags.filter(tag =>
                          note.tags.includes(tag.id)).map(tag => "| " + tag.name + " ")}</small></Col>
                      </Row>
                    </ListGroupItem>
                  ))
              }
            </ListGroup>
          </div>

          <div className="flex-2">
            {
              this.state.notes.some((item)=>item.id===this.props.match.params.noteID) && <NoteEdit match={this.props.match} history={this.props.history}/>
            }

          </div>

      </div>
    );
  }
}
