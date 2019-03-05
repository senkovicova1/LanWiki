import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import ListNotes from './ListNotes';
import TagAdd from './TagAdd';
import TagEdit from './TagEdit';
import ListUsers from './ListUsers';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';

export default class Navigation extends Component {
  render(){
    return(
      <div>
        <div className="row">
        <Sidebar {...this.props}/>
          <div className="flex">
            <Route exact path='/notes' component={ListNotes} />
            <Route exact path='/notes/:tagID' component={ListNotes} />
            <Route exact path='/notes/:tagID/:noteID' component={ListNotes} />

            <Route exact path='/tags/add' component={TagAdd} />
            <Route exact path='/tags/:tagID' component={TagEdit} />

            <Route exact path='/users' component={ListUsers} />
            <Route exact path='/users/:userID' component={ListUsers} />

          </div>
        </div>

      </div>
    )
  }
}
