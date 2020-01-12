import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import Authentication from 'modules/authentication/authentication';

const privateRouter = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => Authentication.isAuthenticated() ? 
            ( <Component {...props} {...rest} /> ) : (
            <Redirect to={{pathname: '/login', state: {from: props.location} }} />
        )} />
    );
};


export default privateRouter;