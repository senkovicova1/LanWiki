import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, ListGroup, ListGroupItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';


export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      loading: true,
      name: "",
      body: "",
      dropdownOpen: false,
      tags: [],
      chosenTags: [],
    }

    this.findName.bind(this);
    this.addTag.bind(this);
    this.removeTag.bind(this);
    this.toggle.bind(this);
    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.noteID);
  }

  fetchData(id){
    rebase.get('notes/' + id, {
      context: this,
    }).then((note) =>
            {
              rebase.get('/tags', {
                context: this,
                withIds: true,
              }).then((tags) => this.setState({name: note.name, body: note.body, chosenTags: note.tags, tags, loading:false})  );
            })

  }

  componentWillReceiveProps(props){
    if(this.props.match.params.noteID!==props.match.params.noteID){
      this.setState({loading:true});
      this.fetchData(props.match.params.noteID);
    }
  }

  submit(){
    this.setState({saving:true});
    rebase.updateDoc('/notes/'+this.props.match.params.noteID, {name:this.state.name, body:this.state.body, tags: this.state.chosenTags})
    .then(() => {
      this.setState({
        saving:false,
      });
    });
  }

  remove(){
    if (window.confirm("Chcete zmazať túto poznámku?")) {
      rebase.removeDoc('/notes/'+this.props.match.params.noteID)
      .then(() => {
        this.props.history.goBack();
      });
    }
  }

  addTag(id){
    this.setState({
      chosenTags: [...this.state.chosenTags, id],
    })
  }

  removeTag(id){
    this.setState({
      chosenTags: this.state.chosenTags.filter(tagId => tagId !== id),
    })
  }

  toggle() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
  }

  findName(id){
    return this.state.tags.filter(tag => tag.id === id)[0].name;
  }

  render(){
    return (
      <div >
          <FormGroup>
            <Label htmlFor="name">Názov</Label>
            <Input id="name" placeholder="Názov" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
          </FormGroup>

          <FormGroup>
              <Label htmlFor="tag">Tags</Label>
              <ListGroup id="tag">
            {
              this.state.chosenTags
              .map(id => {
                return(
                  <ListGroupItem key={id}>
                    {this.findName(id)} <FontAwesomeIcon icon="minus-square" onClick={() => this.removeTag(id)}/>
                  </ListGroupItem>
        );
              })

            }
            </ListGroup>
          </FormGroup>

          {(this.state.tags.length !== this.state.chosenTags.length)
          &&
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle.bind(this)}>
                  <DropdownToggle caret color="success">
                    Add tag
                  </DropdownToggle>
                  <DropdownMenu>
                    {

                      this.state.tags.map(
                        tag => {
                          if (!this.state.chosenTags.includes(tag.id)){
                              return (
                              <DropdownItem
                                key={tag.id}
                                onClick={() => {this.addTag(tag.id)}}>
                                 {tag.name}
                              </DropdownItem>
                            );
                          }
                        }
                      )
                    }
                  </DropdownMenu>
                </ButtonDropdown>
            }

          <FormGroup>
            <Label htmlFor="body">Text</Label>
            <Input type="textarea" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
          </FormGroup>

          <Button disabled={this.state.loading || this.state.saving} color="primary" onClick={this.submit.bind(this)} >{!this.state.saving ? "Save":"Saving..."}</Button>
          <Button disabled={this.state.loading || this.state.saving} color="danger" onClick={this.remove.bind(this)} >Delete</Button>
      </div>
    );
  }
}
