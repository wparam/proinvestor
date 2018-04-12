import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';

import HeaderLinks from '../Header/HeaderLinks.jsx';

import imagine from 'img/sidebar-3.jpg';
import logo from 'img/reactlogo.png';

import appRoutes from '../../routes/routes.jsx';

class Sidebar extends Component{
    constructor(props){
        super(props);
    } 
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
    }
    render(){
        const sidebarBackground = {
            backgroundImage: 'url(' + imagine + ')'
        };
        return (
            <div id='sidebar' className='sidebar' data-color='black' data-image={imagine}>
                <div className='sidebar-background' style={sidebarBackground}></div>
                    <div className='logo'>
                        <a href='' className='simple-text logo-mini'>
                            <div className='logo-img'>
                                <img src={logo} alt='logo_image'/>
                            </div>

                        </a>
                        <a href='' className='simple-text logo-normal'>
                            Asset Manager
                        </a>
                    </div>
                <div className='sidebar-wrapper'>
                    <ul className='nav'>
                        {
                            appRoutes.map((prop,key) => {
                                if(!prop.redirect)
                                    return (
                                        <li className={prop.upgrade ? 'active active-pro':this.activeRoute(prop.path)} key={key}>
                                            <NavLink to={prop.path} className='nav-link' activeClassName='active'>
                                                <i className={prop.icon}></i>
                                                <p>{prop.name}</p>
                                            </NavLink>
                                        </li>
                                    );
                                return null;
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
