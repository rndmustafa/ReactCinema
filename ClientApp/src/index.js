import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Auth from './util/Auth';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const auth = new Auth();

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <App auth={auth}/>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();
