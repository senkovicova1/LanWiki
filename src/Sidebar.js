import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { rebase } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';
import Login from './Login';

class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags : [],
      openLogin: true,
    }
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags})},
    });
  }

  componentWillUnmount() {
      rebase.removeBinding(this.ref);
  }

  logged(){
    this.setState({openLogin: false});
  }

  render() {
    return (
      <div className="app">

        <Modal isOpen={this.state.openLogin} >
           <ModalHeader>Login</ModalHeader>
           <ModalBody>
               <Login logged={() => this.logged()}/>
           </ModalBody>
         </Modal>

      <ListGroup className='sidebar'>

            <ListGroupItem
              className='sidebarItem'
              key={1000}
              color="info"
              style={{color: 'rgb(0, 123, 255)'}}>
                Username
              <Link className='link' to={{pathname: `/users`}}  key={0}>
                <Button color="link"> <FontAwesomeIcon icon="cog" style={{color: 'rgb(0, 123, 255)'}}/></Button>

              </Link>
          </ListGroupItem>


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
                              <Link className='link' to={{pathname: `/tags/${asset.id}`}}  style={{color: 'rgb(255, 255, 255)'}}><FontAwesomeIcon icon="cog" /></Link>
                        </ListGroupItem>
                      )
                    } else {
                      return (
                        <ListGroupItem
                           className='sidebarItem'
                           key={asset.id}
                           active={false}>
                              <Link className='link' to={{pathname: `/notes/${asset.id}`}} >    {asset.name} </Link>
                              <Link className='link' to={{pathname: `/tags/${asset.id}`}}  ><FontAwesomeIcon icon="cog" /></Link>
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
