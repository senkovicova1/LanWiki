import React, { Component } from 'react';
import { Button, FormGroup, Progress, Input } from 'reactstrap';
import Select from 'react-select';

import { rebase } from './index';


export default class ServerEdit extends Component{

  constructor(props){
    super(props);

    this.state = {
      item: {
        name: "",
        ip: "",
        companyId: "",
        statusId: "",
      },

      companies: [],
      statuses: [],

      value: 0,
    }

    this.handleChangeName.bind(this);
    this.handleChangeCompany.bind(this);
    this.handleChangeStatus.bind(this);
    this.addItem.bind(this);

    this.fetch.bind(this);
    this.fetch();
    }

    fetch(){
      rebase.get(`/cmdb/items/servers/${this.props.match.params.serverID}`, {
        context: this,
        withIds: true,
      }).then((server) => {
        rebase.get('/cmdb/cmdb/statuses', {
          context: this,
          withIds: true,
        }).then((stats) => {
          rebase.get('/cmdb/cmdb/companies', {
            context: this,
            withIds: true,
          }).then((comps) => {
              this.setState({
                item: server,
                statuses: stats.map(st => ({value: st.id, label: st.name})),
                companies: comps.map(cmp => ({value: cmp.id, label: cmp.name})),
                value: 100,
              });
            });
        });
      });
    }

  addItem(){
    rebase.updateDoc(`/cmdb/items/servers/${this.props.match.params.serverID}`,
    this.state.item
    ).then((data) =>
      this.setState({
        item: {
          name: "",
          ip: "",
          companyId: "",
          statusId: "",
        }
      })
    );
    this.props.history.push(`/cmdb/servers`);
  }

  handleChangeName(value){
    let newItem = {...this.state.item};
    newItem.name = value;
    this.setState({
      item: newItem,
    });
  }

  handleChangeIP(value){
    let newItem = {...this.state.item};
    newItem.ip = value;
    this.setState({
      item: newItem,
    });
  }

  handleChangeCompany(value){
    let newItem = {...this.state.item};
    newItem.companyId = value;
    this.setState({
      item: newItem,
    });
  }

  handleChangeStatus(value){
    let newItem = {...this.state.item};
    newItem.statusId = value;
    this.setState({
      item: newItem,
    });
  }

  render(){
    if (this.props.match.params.serverID === "add"){
      return (
        <div ></div>);
    }
    return (
      <div >
        <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

        <h2>+ Server</h2>

        <FormGroup>
                <Input id="name" placeholder="Name" value={(this.state.item ? this.state.item.name : "")} onChange={(e) => this.handleChangeName(e.target.value)}/>
        </FormGroup>

        <FormGroup>
                <Input id="ip" placeholder="ip-address" value={(this.state.item ? this.state.item.ip : "")} onChange={(e) => this.handleChangeIP(e.target.value)}/>
        </FormGroup>

        <FormGroup>
          { this.state.companies.length > 0
            &&
            <Select
              defaultValue={{value: this.state.item.companyId, label: this.state.companies.filter(cmp => cmp.value === this.state.item.companyId)[0].label}}
              onChange={(e) => this.handleChangeCompany(e.value)}
              style={{zIndex: 999}}
              options={this.state.companies}
              />
          }
        </FormGroup>

        <FormGroup>
          { this.state.statuses.length > 0
            &&
            <Select
              defaultValue={{value: this.state.item.statusId, label: this.state.statuses.filter(st => st.value === this.state.item.statusId)[0].label}}
              onChange={(e) => this.handleChangeStatus(e.value)}
              style={{zIndex: 999}}
              options={this.state.statuses}
              />
          }
        </FormGroup>

        <Button color="success" onClick={() => this.addItem()}>Save</Button>
        {"  "}
        <Button color="secondary" onClick={() => this.props.history.push(`/cmdb/servers`)}>Cancel</Button>
      </div>
    );
  }
}

//<Button color="success" onClick={this.submit.bind(this)} >{!this.state.saving ? "Add":"Adding..."}</Button>
