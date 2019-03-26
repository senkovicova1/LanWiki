import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { rebase } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';
import Login from './Login';

import store from "./redux/Store";
import firebase from 'firebase';
import { loginUser } from "./redux/actions/index";

class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags : [],
      openLogin: false,
      logged: false,
      uid: null,
      username: "Log in"
    }
    this.logged.bind(this);
    this.logout.bind(this);
    this.fetch.bind(this);
  }

  fetch(){
    rebase.get('users', {
      context: this,
      withIds: true,
    }).then((users) => {
        if (this.state.uid !== null){
          let user = this.state.users.filter(u => u.id === this.state.uid)[0];

          store.dispatch(loginUser(user));
      }
    });
  }


  componentWillMount(){
    this.ref = rebase.listenToCollection('/tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags})},
    });

   this.authSubscription = firebase.auth().onAuthStateChanged((u) => {
      this.setState({
        uid: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null
      });
    });

  }

  componentWillUnmount() {
  //  this.authSubscription();
    rebase.removeBinding(this.ref);
  }

  logged(){
    this.setState({openLogin: false, logged: true, username: (store.getState().user ? store.getState().user.username : "Log in")});
    this.props.history.push(`/notes/all`);
  }

  logout(){
    store.dispatch(loginUser({username: "Log in"}));
    firebase.auth().signOut();
    this.setState({openLogin: false, logged: false, username: "Log in"});
    this.props.history.push(`/notes/all`);
  }

  cancelLog(){
    this.setState({openLogin: false, logged: false});
  }

  render() {
    /*if (this.state.users && this.state.uid !== null && store.getState().user.username === "Log in"){
      let user = this.state.users.filter(u => u.id === this.state.uid)[0];
      store.dispatch(loginUser(user));
  }*/
    return (
      <div className="app">

        <Modal isOpen={this.state.openLogin} >
           <ModalHeader>Login</ModalHeader>
           <ModalBody>
               <Login logged={() => this.logged()} cancel={() => this.cancelLog()}/>
           </ModalBody>
         </Modal>

      <ListGroup className='sidebar'>

            <ListGroupItem
              className='sidebarItem'
              key={1000}
              color="info"
              style={{color: 'rgb(0, 123, 255)'}}>

                {store.getState().user.username === "Log in"
                &&
                <Button color="link" onClick={() => this.setState({openLogin: true})}>
                  {store.getState().user.username}
                </Button>
                }

                {
                  store.getState().user.username !== "Log in"
                  &&
                  store.getState().user.username
                }

                { store.getState().user.username !== "Log in"
                  &&
                  <Link className='link' to={{pathname: `/users`}}  key={0}>
                    <Button color="link"> <FontAwesomeIcon icon="user-cog" style={{color: 'rgb(0, 123, 255)'}}/></Button>
                  </Link>
                }
                { this.state.logged
                  &&
              <Button color="link" onClick={() => this.logout()}> <FontAwesomeIcon icon="sign-out-alt" style={{color: 'rgb(0, 123, 255)'}}/></Button>
                  }

          </ListGroupItem>

          { //add tag sa ukaze iba prihlasenym pouzivatelom
            store.getState().user.username !== "Log in"
            &&
            <Link className='link' to={{pathname: `/tags/add`}}  key={0}>
              { window.location.pathname.includes('/tags/add')
                &&
                  <ListGroupItem
                    className='sidebarItem'
                    key={0}
                    active={true}
                    style={{color: 'rgb(255, 255, 255)'}}>
                    Add tag +
                  </ListGroupItem>
              }

              { !window.location.pathname.includes('/tags/add')
                &&
                  <ListGroupItem
                    className='sidebarItem'
                    key={0}
                    active={false}>
                    Add tag +
                  </ListGroupItem>
              }
          </Link>
          }

            <Link className='link' to={{pathname: `/notes/all`}}  key={1}>
              { window.location.pathname.includes('/notes/all')
                &&
                  <ListGroupItem
                    className='sidebarItem'
                    key={1}
                    active={true}
                    style={{color: 'rgb(255, 255, 255)'}}>
                    All
                  </ListGroupItem>
              }
              { !window.location.pathname.includes('/notes/all')
                &&
                  <ListGroupItem
                    className='sidebarItem'
                    key={1}
                    active={false}>
                    All
                  </ListGroupItem>
              }
          </Link>

          {
              this.state.tags
              .filter(tag => tag.public || (store.getState().user.username !== 'Log in' && tag.read.includes(store.getState().user.id)))
                .map(asset =>
                  {
                    let active = window.location.pathname.includes(asset.id);
                    if (active) {
                      return (
                        <ListGroupItem
                           className='sidebarItem'
                           key={asset.id}
                           active={true}>
                              <Link className='link' to={{pathname: `/notes/${asset.id}`}} style={{color: 'rgb(255, 255, 255)'}}>    {asset.name} </Link>
                                { store.getState().user.username !== "Log in"
                                  &&
                                    <Link className='link' to={{pathname: `/tags/${asset.id}`}}  style={{color: 'rgb(255, 255, 255)'}}><FontAwesomeIcon icon="cog" /></Link>
                                }
                       </ListGroupItem>
                      )
                    } else {
                      return (
                        <ListGroupItem
                           className='sidebarItem'
                           key={asset.id}
                           active={false}>
                              <Link className='link' to={{pathname: `/notes/${asset.id}`}} >    {asset.name} </Link>
                              { store.getState().user.username !== "Log in"
                                &&
                                  <Link className='link' to={{pathname: `/tags/${asset.id}`}}  ><FontAwesomeIcon icon="cog" /></Link>
                              }
                       </ListGroupItem>
                      )
                    }
                  })
            }
          </ListGroup>
      </div>
    );
  }
}

export default Sidebar;
