import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Progress, } from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { rebase } from './index';

import store from "./redux/Store";
import firebase from 'firebase';

class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags : [],
      items: [],
      companies: [],
      chosenCompany: null,
      unsubscribe: null,

      value: 0,
      pointless: 42,
    }

    this.handleChangeSelect.bind(this);
    this.handleChange.bind(this);
    this.fetch.bind(this);
    this.fetch();
  }

  fetch(){
    rebase.get('/cmdb/item-access', {
      context: this,
      withIds: true,
    }).then((items) => {
          this.setState({
            itemAccess: items,
            value: 100,
          });
    });
  }

  componentWillMount(){
    this.setState({
      value: 0,
    });
    const unsub = store.subscribe(this.handleChange.bind(this));
    this.ref = rebase.listenToCollection('/cmdb/cmdb/companies', {
      context: this,
      withIds: true,
      then: comps=>{
        this.setState({
          companies: comps.map(cmp => ({value: cmp.id, label: cmp.name})),
          unsubscribe: unsub,
          value: 100})
      },
    });

   this.authSubscription = firebase.auth().onAuthStateChanged((u) => {
      this.setState({
        uid: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null,
        value: 100,
      });
    });

  }

  handleChangeSelect(value){
    this.setState({
      chosenCompany: value,
    });
  }

  handleChange(){
    this.setState({
      pointless: 43,
    });
  }

  componentWillUnmount() {;
    this.state.unsubscribe();
  //  this.authSubscription();
    rebase.removeBinding(this.ref);
  }


  render() {
  //  console.log((this.state.companies.length > 0 ? this.state.companies[0].label : "Select..." ));
    return (
      <div className="app">
        <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

      <ListGroup className='sidebar'>

            <ListGroupItem
              className='sidebarItem'
              key={1000}
              color="info"
              style={{color: 'rgb(0, 123, 255)'}}>
              Company
              <Select
                defaultValue={{ label: (this.state.companies.length > 0 ? this.state.companies[0].label : "Select..." ), value: (this.state.companies.length > 0  ? this.state.companies[0].value : 0 ) }}
                onChange={(e) => this.handleChangeSelect(e.value)}
                style={{zIndex: 999}}
                options={this.state.companies}
                />
            </ListGroupItem>

          { this.state.chosenCompany !== null
            &&
            this.state.itemAccess[this.state.chosenCompany].map(item =>
              <ListGroupItem
                 className='sidebarItem'
                 key={item}
                 style={(window.location.pathname.includes(item) ? {backgroundColor: 'rgb(0, 123, 255)'} : {color: 'rgb(255, 255, 255)'})}>
                    <Link className='link' to={{pathname: `/cmdb/${item}`}} style={(window.location.pathname.includes(item) ? {color: 'rgb(255, 255, 255)'} : {})}>    {item} </Link>

             </ListGroupItem>
            )
          }
          <ListGroupItem key="0"
            >
            {"   "}
          </ListGroupItem>

          <ListGroupItem
            className='sidebarItem'
            key="tags"
            style={(window.location.pathname.includes("tags") ? {backgroundColor: 'rgb(0, 123, 255)'} : {color: 'rgb(255, 255, 255)'})}>
            <Link className='link' to={{pathname: `/cmdb/tags`}} style={(window.location.pathname.includes("tags") ? {color: 'rgb(255, 255, 255)'} : {})}> Tags </Link>
          </ListGroupItem>

          <ListGroupItem
            className='sidebarItem'
            key="statuses"
            style={(window.location.pathname.includes("statuses") ? {backgroundColor: 'rgb(0, 123, 255)'} : {color: 'rgb(255, 255, 255)'})}>
            <Link className='link' to={{pathname: `/cmdb/statuses`}} style={(window.location.pathname.includes("statuses") ? {color: 'rgb(255, 255, 255)'} : {})}> Statuses </Link>
          </ListGroupItem>

          <ListGroupItem
            className='sidebarItem'
            key="companies"
            style={(window.location.pathname.includes("companies") ? {backgroundColor: 'rgb(0, 123, 255)'} : {color: 'rgb(255, 255, 255)'})}>
            <Link className='link' to={{pathname: `/cmdb/companies`}} style={(window.location.pathname.includes("companies") ? {color: 'rgb(255, 255, 255)'} : {})}> Companies </Link>
          </ListGroupItem>

        </ListGroup>

      </div>
    );
  }
}

export default Sidebar;
