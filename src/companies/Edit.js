import React, { Component } from 'react';
import { Button, FormGroup, Progress, Label, Input, InputGroup, ListGroup, ListGroupItem, Table } from 'reactstrap';

import { rebase } from '../index';

import store from "../redux/Store";

export default class TagAdd extends Component{

  constructor(props){
    super(props);

    this.state = {
      item: this.props.item,

      value: 100,
    }

    this.submit.bind(this);
    this.handleChangeName.bind(this);
    this.handleChangeActive.bind(this);
  }


  submit(){
    rebase.updateDoc(`/cmdb/cmdb/companies/${this.props.itemId}`,
    this.state.item
    ).then((data) =>
      this.setState({
        item: {
          name: "",
          active: false,
        }
      })
    );
    this.props.closeModal();
  }

  handleChangeName(value){
    let newItem = {...this.state.item};
    newItem.name = value;
    this.setState({
      item: newItem,
    });
  }

  handleChangeActive(value){
    let newItem = {...this.state.item};
    newItem.active = value;
    this.setState({
      item: newItem,
    });
  }

  render(){
    return (
      <div >

        <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            checked={this.state.item.active}
            onChange={(e) => this.handleChangeActive(e.target.checked)}
            />{' '}
          Active
        </Label>
      </FormGroup>


          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Názov" value={this.state.item.name} onChange={(e) => this.handleChangeName(e.target.value)}/>
          </FormGroup>


          <Button disabled={this.state.saving} color="success" onClick={this.submit.bind(this)}>Edit</Button>
            {"   "}
            <Button disabled={this.state.saving} color="secondary" onClick={() => this.props.closeModal()} >Cancel</Button>
      </div>
    );
  }
}
