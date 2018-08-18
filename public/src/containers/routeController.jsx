import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import App from 'containers/app.jsx';
import Login from 'containers/login.jsx';
import Authentication from 'modules/authentication/authentication';
import PrivateRouter from 'components/PrivateRouter/privateRouter';

export default class RouterController extends React.Component {
    render (){
        return (<BrowserRouter>
                    <Switch>
                        <Route exact path='/login' name='Login' component={Login} />) : 
                        <PrivateRouter path='/' name='Home' component={App} />) }
                    </Switch>
                </BrowserRouter>
        );
    }
}
