import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '../resource/css/bootstrap.min.css';
import '../resource/css/animate.min.css';
import '../resource/sass/light-bootstrap-dashboard.css';
import '../resource/css/demo.css';
import '../resource/css/pe-icon-7-stroke.css';

import App from 'containers/app.jsx';
import Login from 'containers/login.jsx';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path='/login' name='Login' component={Login} />
            <Route path='/' name='Home' component={App} />
        </Switch>
    </BrowserRouter>
), document.getElementById('root')); 


