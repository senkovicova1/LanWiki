import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';

import { rebase } from './index';


export default class TagEdit extends Component{

  constructor(props){
    super(props);

    if (this.props.match.params.tagID === 'add')
    {
      return;
    };

    this.state = {
      saving: false,
      loading: true,
      name: "",
      body: "",
    }

    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.tagID);
  }

  fetchData(id){
    rebase.get('tags/' + id, {
      context: this,
    }).then((tag) =>
        this.setState({name: tag.name, body: tag.body, loading:false}));
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.tagID!==props.match.params.tagID){
      this.setState({loading:true});
      this.fetchData(props.match.params.tagID);
    }
  }

  submit(){
    this.setState({saving:true});
    rebase.updateDoc('/tags/'+this.props.match.params.tagID, {name:this.state.name, body:this.state.body})
    .then(() => {
      this.setState({
        saving:false,
      });
    });
  }

  remove(){
    if (window.confirm("Chcete zmazať tento tag?")) {
      rebase.removeDoc('/tags/'+this.props.match.params.tagID)
        .then(() =>
            { rebase.get('/notes', {
                context: this,
                withIds: true,
              })
              .then((notes) =>
                notes.filter(note => (note.tags.includes(this.props.match.params.tagID)))
                .map(note =>
                    rebase.updateDoc('/notes/'+note.id, {name: note.name, body: note.body, tags: note.tags.filter(item => item !== this.props.match.params.tagID)})
                    )                
              )
            });
      this.props.history.goBack();
      };
  }

  render(){
    if (this.props.match.params.tagID === 'add')
    {
      return (<div></div>);
    };
    return (
      <div >
          <FormGroup>
            <Label htmlFor="name">Názov</Label>
            <Input id="name" placeholder="Názov" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="body">Popis</Label>
            <Input type="textarea" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
          </FormGroup>

          <Button disabled={this.state.loading || this.state.saving} color="primary" onClick={this.submit.bind(this)} >{!this.state.saving ? "Save":"Saving..."}</Button>
          <Button disabled={this.state.loading || this.state.saving} color="danger" onClick={this.remove.bind(this)} >Delete</Button>
      </div>
    );
  }
}
