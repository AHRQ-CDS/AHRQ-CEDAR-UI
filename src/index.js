import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import _ from 'lodash';
import Loading from './Loading';
import App from './App';
import { SMART } from './FHIRClientWrapper';
import reportWebVitals from './reportWebVitals';

// See if we're being launched from within a SMART on FHIR context
switch (_.last(window.location.pathname.split('/'))) {
case 'launch':
  const scope = 'patient/*.read user/Patient.read openid profile online_access';
  const clientId = '17eff9ba-9445-426f-a457-b49ee385464e';
  const launchUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
  const redirectUri = launchUri.replace('launch', 'smart');
  SMART.authorize({ client_id: clientId, scope: scope, redirect_uri: redirectUri });
  ReactDOM.render(<React.StrictMode><Loading /></React.StrictMode>, document.getElementById('root'));
  break;
case 'smart':
  ReactDOM.render(<React.StrictMode><App smart /></React.StrictMode>, document.getElementById('root'));
  break;
case 'standalone':
  console.log("standalone");
  ReactDOM.render(<React.StrictMode><App standalone /></React.StrictMode>, document.getElementById('root'));
  break;
default:
  ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, document.getElementById('root'));
  break;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();