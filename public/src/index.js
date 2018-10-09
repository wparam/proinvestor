import React from 'react';
import ReactDOM from 'react-dom';
import Redux, {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from 'redux/reducers';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '../resource/css/bootstrap.min.css';
import '../resource/css/animate.min.css';
import '../resource/sass/light-bootstrap-dashboard.css';
import '../resource/css/am.css';
import '../resource/css/pe-icon-7-stroke.css';

import RouterController from 'components/RouteController/routeController.jsx';

const store = createStore(reducers);

ReactDOM.render((
    <Provider store={store}>
        <RouterController/>
    </Provider>
), document.getElementById('root')); 



