import React, {Component} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Sidebar from './Sidebar';
import Note from './Note';
import ListNotes from './ListNotes';


export default class Navigation extends Component {
  render(){
    return(
      <div>
        <div className="row">
          <ListNotes {...this.props}/>
          <div className="flex">
            <Note {...this.props}/>
          </div>
        </div>

      </div>
    )
  }
}
