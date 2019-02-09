import React, { Component } from 'react';
import { ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText, Input  } from 'reactstrap';
import { rebase } from './index';
import NoteAdd from './NoteAdd';
import NoteEdit from './NoteEdit';

export default class ListNotes extends Component{

  constructor(props){
    super(props);

    this.state = {
      notes: [],
    }
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/notes', {
      context: this,
      withIds: true,
      then:notes=>{this.setState({notes})},
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
              <InputGroupAddon addonType="prepend">@</InputGroupAddon>
              <Input placeholder="Search" />
            </InputGroup>

            <ListGroup>
              {
                  [{id: "add", name:"Add"}].concat(this.state.notes).map(note => (
                    <ListGroupItem
                      active={this.props.match.params.noteID ? (this.props.match.params.noteID === note.id) : false}
                      tag="a"
                      href={"/notes/" + note.id}
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push("/notes/" + note.id);
                      }}
                      action
                      key={note.id}
                      >{note.name}</ListGroupItem>
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
