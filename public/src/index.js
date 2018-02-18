import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../resource/scss/style.scss'


import App from './containers/app.jsx'


ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/" name="Home" component={App} />
        </Switch>
    </HashRouter>
), document.getElementById('root')); 


