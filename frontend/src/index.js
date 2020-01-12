import React from 'react';
import ReactDOM from 'react-dom';
import Redux, {createStore} from 'redux';
import {Provider} from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import configStore from 'redux/configureStore';

import '../resource/sass/light-bootstrap-dashboard.scss';
import '../resource/sass/main.scss';
import '../resource/fontawesome-free/css/all.css';

import '../resource/css/bootstrap.min.css';
import '../resource/css/animate.min.css';
import '../resource/css/am.css';
import '../resource/css/pe-icon-7-stroke.css';


import RouterController from 'components/RouteController/routeController.jsx';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faCoffee)

// const store = createStore(reducers);

const { store, persistor} = configStore();

window.store = store;

ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterController/>
        </PersistGate>
    </Provider>
), document.getElementById('root')); 



