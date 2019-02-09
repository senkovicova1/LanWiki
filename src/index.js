import React from 'react';
import ReactDOM from 'react-dom';
import App from './navigation';
import config from './firestore';
import {BrowserRouter} from 'react-router-dom';
import base from 'firebase';
import Rebase from 're-base';
import './scss/index.scss';


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
