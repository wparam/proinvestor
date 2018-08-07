import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import '../resource/css/bootstrap.min.css';
import '../resource/css/animate.min.css';
import '../resource/sass/light-bootstrap-dashboard.css';
import '../resource/css/demo.css';
import '../resource/css/pe-icon-7-stroke.css';

import '../resource/css/login.css';

import App from 'containers/app.jsx';
import Login from 'containers/login.jsx';


ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route exact path='/' name='Home' component={App} />
            <Route exact path='/login' name='Login' component={Login} />
        </Switch>
    </HashRouter>
), document.getElementById('root')); 


