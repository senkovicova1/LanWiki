import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { rebase } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';

class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags : [],
      openAdd: false,
      openEdit: false,

      fname: "",
      lname: "",
      email: "",
      pass1: "",
      pass2: "",
    }

    this.addData.bind(this);
    this.submit.bind(this);
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

  submit(){
    
    this.setState({
      openAdd: false,
      openEdit: false,
    });
  }

  addData(value, data){
    switch (value) {
      case 'fname':
        this.setState({fname: data});
        break;
      case 'lname':
        this.setState({lname: data});
        break;
      case 'email':
        this.setState({email: data});
        break;
      case 'pass1':
        this.setState({pass1: data});
        break;
      default:
        this.setState({pass2: data});
        break;
    }
  }

  render() {
    console.log(window.location.pathname);
    return (
      <div className="app">

       <Modal isOpen={this.state.openAdd} >
          <ModalHeader>Add user</ModalHeader>
          <ModalBody>
              <UserAdd addData={() => this.addData()}/>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={() => this.submit()}>Save</Button>{' '}
            <Button color="secondary" onClick={() => this.setState({openAdd: false})}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.openEdit} >
           <ModalHeader>Edit users</ModalHeader>
           <ModalBody>
               <UserEdit match={this.props.match} history={this.props.history}/>
           </ModalBody>
           <ModalFooter>
             <Button color="secondary" onClick={() => this.setState({openEdit: false})}>Cancel</Button>
           </ModalFooter>
         </Modal>

      <ListGroup className='sidebar'>

            <ListGroupItem
              className='sidebarItem'
              key={1000}
              color="info"
              style={{color: 'rgb(0, 123, 255)'}}>
                Username
              <Button color="link"> <FontAwesomeIcon icon="cog" style={{color: 'rgb(0, 123, 255)'}} onClick={() => this.setState({openEdit: true})}/></Button>
              <Button color="link" style={{color: 'rgb(0, 123, 255)'}} onClick={() => this.setState({openAdd: true})}>+</Button>
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
