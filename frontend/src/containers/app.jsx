import React, { Component } from 'react';
import {   Route,  Switch, Redirect } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

import Header from 'components/Header/Header.jsx';
import Footer from 'components/Footer/Footer.jsx';
import Sidebar from 'components/Sidebar/Sidebar.jsx';

import {style} from 'components/variables/Variables.jsx';
import Dashboard from 'views/Dashboard/Dashboard';
import appRoutes from 'routes/routes.jsx';


class App extends Component {
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleNotificationClick = this.handleNotificationClick.bind(this);        
        this.state = {
            _notificationSystem: null
        };
    }
    handleNotificationClick(position){
        var color = Math.floor((Math.random() * 4) + 1);
        var level;
        switch (color) {
            case 1:
                level = 'success';
                break;
            case 2:
                level = 'warning';
                break;
            case 3:
                level = 'error';
                break;
            case 4:
                level = 'info';
                break;
            default:
                break;
        }
        this.state._notificationSystem.addNotification({
            title: (<span data-notify='icon' className='pe-7s-gift'></span>),
            message: (
                <div>
                    Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer.
                </div>
            ),
            level: level,
            position: position,
            autoDismiss: 15,
        });
    }
    componentDidMount(){
        this.setState({_notificationSystem: this.notificationSystem});
        var _notificationSystem = this.notificationSystem;
        var color = Math.floor((Math.random() * 4) + 1);
        var level;
        switch (color) {
            case 1:
                level = 'success';
                break;
            case 2:
                level = 'warning';
                break;
            case 3:
                level = 'error';
                break;
            case 4:
                level = 'info';
                break;
            default:
                break;
        }
        _notificationSystem.addNotification({
            title: (<span data-notify='icon' className='pe-7s-gift'></span>),
            message: (
                <div>
                    Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer.
                </div>
            ),
            level: level,
            position: 'tr',
            autoDismiss: 15,
        });
    }
    componentDidUpdate(e){
        if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
            document.documentElement.classList.toggle('nav-open');
        }
    }
    toggleSidebar(){
        console.log('toggle');
    }
    render() {
        return (
            <div className='wrapper'>
                <NotificationSystem ref={(noti) => { this.notificationSystem = noti; }} style={style}/>
                <Sidebar {...this.props} onToggle={this.toggleSidebar}/> 
                <div id='main-panel' className='main-panel'>
                    <Header {...this.props}/>
                        <Switch>
                            {
                                appRoutes.map((prop,key) => {
                                    if(prop.name === 'Notifications')
                                        return (
                                            <Route path={prop.path} key={key} render={routeProps =>
                                                    <prop.component {...routeProps} handleClick={this.handleNotificationClick}/>}
                                            />
                                        );
                                    if(prop.redirect)
                                        return (
                                            <Redirect exact from={prop.path} to={prop.to} key={key}/>
                                        );
                                    return (
                                        <Route path={prop.path} component={prop.component} key={key}/>
                                    );
                                })
                            }
                        </Switch>
                    <Footer />
                </div>
            </div> 
        );
    }
}

export default App;
