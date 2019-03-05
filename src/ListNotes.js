import React, { Component } from 'react';
import { ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText, Input  } from 'reactstrap';
import { rebase } from './index';
import NoteAdd from './NoteAdd';
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
    }
  }

  componentWillMount(){
    this.ref1 = rebase.listenToCollection('/notes', {
      context: this,
      withIds: true,
      then: notes=> this.setState({notes})
    });
    this.ref2 = rebase.listenToCollection('/tags', {
      context: this,
      withIds: true,
      then: tags=> this.setState({tags})
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref1);
    rebase.removeBinding(this.ref2);
  }


  render(){
    return (
      <div className="row">
          <div className='flex-1'>

            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon="search" />
                </InputGroupText>
              </InputGroupAddon>

              <Input placeholder="Search" value={this.state.search} onChange={(e) => this.setState({search: e.target.value})}/>
            </InputGroup>

            <ListGroup>
              {
                  [{id: "add", name:"New note"}]
                  .concat(this.state.notes
                    .filter((item) => item.name.toLowerCase().includes(this.state.search.toLowerCase()))
                    .filter((note) => {
                      let userID = store.getState().user.id;
                      if (this.props.match.params.tagID === 'all'){
                        let cond1 = this.state.tags.filter(tag => note.tags.includes(tag.id) && (tag.read.includes(userID) || tag.public)).length > 0;
                        return cond1;
                      }
                        let cond1 = note.tags.includes(this.props.match.params.tagID);
                        let tag = this.state.tags.filter(t => t.id === this.props.match.params.tagID)[0];
                        let cond2 = tag.public || tag.read.includes(userID);
                        return cond1 && cond2;
                     }))
                  .map(note => (
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
                      >{hightlightText(note.name, this.state.search, '#00FF04')}</ListGroupItem>
                  ))
              }
            </ListGroup>
          </div>

          <div className="flex-2">
            {
              this.props.match.params.noteID && this.props.match.params.noteID ==='add' && <NoteAdd />
            }
            {
              this.props.match.params.noteID && this.props.match.params.noteID!=='add' && this.state.notes.some((item)=>item.id===this.props.match.params.noteID) && <NoteEdit match={this.props.match} history={this.props.history}/>
            }

          </div>

      </div>
    );
  }
}
