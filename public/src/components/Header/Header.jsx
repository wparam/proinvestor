import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

import HeaderLinks from './HeaderLinks.jsx';

import appRoutes from '../../routes/routes.jsx';

class Header extends Component{
    constructor(props){
        super(props);
    }
    getBrand(){
        var name;
        appRoutes.map((prop,key) => {
            if(prop.collapse){
                 prop.views.map((prop,key) => {
                    if(prop.path === this.props.location.pathname){
                        name = prop.name;
                    }
                    return null;
                });
            } else {
                if(prop.redirect){
                    if(prop.path === this.props.location.pathname){
                        name = prop.name;
                    }
                }else{
                    if(prop.path === this.props.location.pathname){
                        name = prop.name;
                    }
                }
            }
            return null;
        });
        return name;
    }
    render(){
        return (
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">{this.getBrand()}</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <HeaderLinks />
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;
