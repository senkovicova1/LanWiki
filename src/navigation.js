import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import Sidebar from './Sidebar';
import ListNotes from './ListNotes';
import TagAdd from './TagAdd';
import TagEdit from './TagEdit';
import ListUsers from './ListUsers';
import Navbar from './Navbar';

import CMDBSidebar from './CMDBSidebar';
import CMDBListItems from './CMDBListItems';
import CMDBServerAdd from './CMDBServerAdd';
import CMDBServerEdit from './CMDBServerEdit';

import TagList from './tags/List';
import StatusList from './statuses/List';
import CompaniesList from './companies/List';


export default class Navigation extends Component {

  render(){
    return(
      <div>
        <Route path='/' component={Navbar}/>

        <div className="row">
          <Route path='/lanwiki' component={Sidebar} />
          <Route path='/cmdb' component={CMDBSidebar} />
          <div className="flex">

            <Route exact path='/lanwiki/notes/:tagID/:noteID' component={ListNotes} />
            <Route exact path='/lanwiki/notes/:tagID' component={ListNotes} />
            <Route exact path='/lanwiki/notes' component={ListNotes} />

            <Route exact path='/lanwiki/tags/add' component={TagAdd} />
            <Route exact path='/lanwiki/tags/:tagID' component={TagEdit} />

            <Route exact path='/lanwiki/users/:userID' component={ListUsers} />
            <Route exact path='/lanwiki/users' component={ListUsers} />

            <Route exact path='/cmdb/servers' component={CMDBListItems} />
            <Route exact path='/cmdb/server-add' component={CMDBServerAdd} />
            <Route exact path='/cmdb/server-:serverID' component={CMDBServerEdit} />

            <Route exact path='/cmdb/tags' component={TagList} />
            <Route exact path='/cmdb/statuses' component={StatusList} />
            <Route exact path='/cmdb/companies' component={CompaniesList} />

          </div>
        </div>

      </div>
    )
  }
}
/*

<div>
<Popover placement="bottom" isOpen={this.state.isOpen} target="items" toggle={this.toggle.bind(this)}>
  <PopoverHeader>

  </PopoverHeader>
     <Input placeholder="Search" value={this.state.searchedWord} onChange={(e) => this.setState({searchedWord: e.target.value})}/>
  <PopoverBody >
    <Table>
       <thead>
         <tr>
           <th>Name</th>
           <th>Date created</th>
           <th>Delete</th>
         </tr>
       </thead>
       <tbody>
         {
           this.state.items
           .filter(item => item.name.toLowerCase().includes(this.state.searchedWord.toLowerCase()))
           .map(item =>
           (
             <tr key={item.id}>
               <td><Input id="name" placeholder="Názov" value={item.name} onChange={(e) => this.changeName(item.id, e.target.value)}/></td>
               <td>{this.niceDate(item.dateCreated)}</td>
               <td><FontAwesomeIcon icon="trash" onClick={() => this.removeItem(item.id)}/></td>
             </tr>
             )
           )
         }
       </tbody>
     </Table>

     <FormGroup>
       <Label htmlFor="name">Add new</Label>
       <Row>
         <Col xs="10">
             <Input id="name" placeholder="Name" value={this.state.newItem} onChange={(e) => this.setState({newItem: e.target.value})}/>
         </Col>
         <Col xs="1">
             <Button color="success" onClick={() => this.addItem()}>+</Button>
         </Col>
       </Row>
     </FormGroup>

  </PopoverBody>
</Popover>
</div>


*/
