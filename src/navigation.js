import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import ListNotes from './ListNotes';

export default class Navigation extends Component {
  render(){
    return(
      <div>
        <div className="row">
        <Sidebar {...this.props}/>
          <div className="flex">
            <Route exact path='/notes' component={ListNotes} />
            <Route exact path='/notes/:noteID' component={ListNotes} />
          </div>
        </div>

      </div>
    )
  }
}
