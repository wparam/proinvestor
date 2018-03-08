import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import '../resource/css/bootstrap.min.css';
import '../resource/css/animate.min.css';
import '../resource/sass/light-bootstrap-dashboard.css';
import '../resource/css/demo.css';
import '../resource/css/pe-icon-7-stroke.css';

import App from './containers/app.jsx'


ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/" name="Home" component={App} />
        </Switch>
    </HashRouter>
), document.getElementById('root')); 


