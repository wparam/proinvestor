import React from 'react';
import ReactDOM from 'react-dom';
import Redux, {createStore} from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '../resource/css/bootstrap.min.css';
import '../resource/css/animate.min.css';
import '../resource/sass/light-bootstrap-dashboard.css';
import '../resource/css/am.css';
import '../resource/css/pe-icon-7-stroke.css';

import RouterController from 'containers/routeController.jsx';


ReactDOM.render((
    <RouterController/>
), document.getElementById('root')); 


