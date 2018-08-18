import {Redirect, Route} from 'react-router-dom';

const privateRouter = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => props.authenticated ? props.component : (
            <Redirect to={{pathname: '/login', state: {from: props.location} }} />
        )} />
    );
};


export default privateRouter;