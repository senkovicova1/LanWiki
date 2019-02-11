import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import ListNotes from './ListNotes';
import TagAdd from './TagAdd';
import TagEdit from './TagEdit';

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
          </div>
        </div>

      </div>
    )
  }
}
