import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class Sidebar extends Component {
  render() {
    const TAGS = {
      a: 'All',
      b: 'Linux',
      c: 'Windows',
      d: 'Config lists',
      e: '+ Tag'
    };
    return (
      <div className="App">

      <div>
        User name
      </div>

        <ListGroup className='sidebar'>
          <Link className='link' to={{pathname: `/`}}  key={0}>
            <ListGroupItem className='sidebarItem' key={0} >
              HOME
            </ListGroupItem>
          </Link>

          {
              Object
                .keys(TAGS)
                .map(asset =>
                  {
                    return(
                      <Link className='link' to={{pathname: `/notes`}}  key={TAGS[asset]}>
                        <ListGroupItem className='sidebarItem' >
                          {TAGS[asset]}
                        </ListGroupItem>
                      </Link>)
                  })
            }
          </ListGroup>
      </div>
    );
  }
}

export default Sidebar;
