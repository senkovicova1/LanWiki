import React from 'react';
import ReactDOM from 'react-dom';
import App from './navigation';
import config from './firestore';
import {BrowserRouter} from 'react-router-dom';
import base from 'firebase';
import Rebase from 're-base';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';

import loadIcons from './icons';
loadIcons();


const app = base.initializeApp(config);
const db = base.firestore(app);

export let rebase = Rebase.createClass(db);
export let firebase = db;

const Root = () => {
  return(
      <BrowserRouter>
        <App />
      </BrowserRouter>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
