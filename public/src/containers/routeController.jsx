import {BrowserRouter, Switch, Route} from 'react-router-dom';

import App from 'containers/app.jsx';
import Login from 'containers/login.jsx';
import PrivateRouter from 'components/PrivateRouter/privateRouter';

export default class RouterController{
    constructor(props){
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.state = {
            authenticated: false
        };
    }
    authenticate(){
        this.setState({authenticated : true});
    }
    deauthenticate(){
        this.setState({authenticated : false});
    }
    render (){
        return (<BrowserRouter>
                    {!this.state.authenticated ? 
                        (<Route exact path='/login' name='Login' component={Login} onSuccessLogin={this.authenticate} />) : 
                        (<PrivateRouter path='/' name='Home' component={App} />) }
                </BrowserRouter>
        );
    }
}