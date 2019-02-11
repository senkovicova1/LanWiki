import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { rebase } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags : [],
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

  render() {
    return (
      <div className="App">

      <div>
        User name
      </div>

      <ListGroup className='sidebar'>
            <Link className='link' to={{pathname: `/tags/add`}}  key={0}>
            <ListGroupItem className='sidebarItem' key={0} >
              Add tag +
            </ListGroupItem>
          </Link>

            <Link className='link' to={{pathname: `/notes/all`}}  key={1}>
            <ListGroupItem className='sidebarItem' key={1} >
              All
            </ListGroupItem>
          </Link>

          {
              this.state.tags
                .map(asset =>
                  {
                    return(

                        <ListGroupItem className='sidebarItem' key={asset.id}>

                          <Link className='link' to={{pathname: `/notes/${asset.id}`}}>    {asset.name} </Link>
                          <Link className='link' to={{pathname: `/tags/${asset.id}`}}  ><FontAwesomeIcon icon="cog" /></Link>

                        </ListGroupItem>
                      )
                  })
            }
          </ListGroup>
      </div>
    );
  }
}

export default Sidebar;
