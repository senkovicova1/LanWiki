import React, { Component } from 'react';
import { ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText, Input  } from 'reactstrap';
import { rebase } from './index';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {hightlightText} from './helperFunctions';

export default class ListUsers extends Component{

  constructor(props){
    super(props);

    this.state = {
      users: [],
      search: "",
      tags: [],
    }
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/users', {
      context: this,
      withIds: true,
      then: users=> this.setState({users})
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
              this.props.match.params.userID && this.props.match.params.userID ==='add' && <UserAdd />
            }
            {
              this.props.match.params.userID && this.props.match.params.userID!=='add' && this.state.users.some((item)=>item.id===this.props.match.params.userID) && <UserEdit match={this.props.match} history={this.props.history}/>
            }

          </div>

      </div>
    );
  }
}
