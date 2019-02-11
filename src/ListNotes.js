import React, { Component } from 'react';
import { ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText, Input  } from 'reactstrap';
import { rebase } from './index';
import NoteAdd from './NoteAdd';
import NoteEdit from './NoteEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {hightlightText} from './helperFunctions';

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
    this.ref = rebase.listenToCollection('/notes', {
      context: this,
      withIds: true,
      then: notes=> this.setState({notes})
    });


  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
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
                  [{id: "add", name:"Add"}]
                  .concat(this.state.notes
                    .filter((item) =>
                    {
                      return (this.props.match.params.tagID === 'all')
                      ||
                      (item.name.toLowerCase().includes(this.state.search.toLowerCase()) && item.tags.includes(this.props.match.params.tagID));

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
