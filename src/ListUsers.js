import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Progress, InputGroup, InputGroupAddon, InputGroupText, Input  } from 'reactstrap';
import { rebase } from './index';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {hightlightText} from './helperFunctions';

import store from "./redux/Store";

export default class ListUsers extends Component{

  constructor(props){
    super(props);

    this.state = {
      users: [],
      search: "",
      tags: [],

      value: 0,
    }
  }

  componentWillMount(){
    this.setState({value: 0});
    this.ref = rebase.listenToCollection('/users', {
      context: this,
      withIds: true,
      then: users=> this.setState({users, value: 100})
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }


  render(){
    if (store.getState().user.username === "Log in" || !store.getState().user.editUsers){
      return(
        <div>
          K tejto stránke nemáte povolený prístup.
        </div>
      );
    }
    return (
      <div className="row">
          <div className='flex-1'>
            <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

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
                [{id: "add", email:"New user +"}]
                .concat(
                  this.state.users.filter((item) => item.email.toLowerCase().includes(this.state.search.toLowerCase())))
                  .map(user => (
                    <ListGroupItem
                      active={this.props.match.params.userID ? (this.props.match.params.userID === user.id) : false}
                      tag="a"
                      href={`/users/${user.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push(`/users/${user.id}`);
                      }}
                      action
                      key={user.id}
                      >{hightlightText(user.email, this.state.search, '#00FF04')}</ListGroupItem>
                  ))
              }
            </ListGroup>
          </div>

          <div className="flex-2">
            {
              this.props.match.params.userID && this.props.match.params.userID ==='add' && <UserAdd match={this.props.match} history={this.props.history}/>
            }
            {
              this.props.match.params.userID && this.props.match.params.userID!=='add' && this.state.users.some((item)=>item.id===this.props.match.params.userID) && <UserEdit match={this.props.match} history={this.props.history}/>
            }

          </div>

      </div>
    );
  }
}
