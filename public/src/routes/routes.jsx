import React, { Component } from 'react';
import Dashboard from 'views/Dashboard/Dashboard';
import Overview from 'views/Overview/Overview';
import UserProfile from 'views/UserProfile/UserProfile';
import TableList from 'views/TableList/TableList';
import Typography from 'views/Typography/Typography';
import Icons from 'views/Icons/Icons';
import Maps from 'views/Maps/Maps';
import Notifications from 'views/Notifications/Notifications';
import System from 'views/System/system';
// import Upgrade from 'views/Upgrade/Upgrade';  //old upgrade

//todo, this should be refactored into a component
const appRoutes = [
    { path: '/dashboard', name: 'Dashboard', icon: 'pe-7s-graph', component:  Dashboard },
    { path: '/overview', name: 'Overview', icon: 'pe-7s-display1', component: Overview },
    { path: '/user', name: 'User Profile', icon: 'pe-7s-user', component: UserProfile },
    { path: '/table', name: 'Table List', icon: 'pe-7s-note2', component: TableList },
    { path: '/typography', name: 'Typography', icon: 'pe-7s-news-paper', component: Typography },
    { path: '/icons', name: 'Icons', icon: 'pe-7s-science', component: Icons },
    { path: '/maps', name: 'Maps', icon: 'pe-7s-map-marker', component: Maps },
    { path: '/notifications', name: 'Notifications', icon: 'pe-7s-bell', component: Notifications },
    { system: true, path: '/system', name: 'System', icon: 'pe-7s-tools', component: System },
    { redirect: true, path:'/', to:'/dashboard', name: 'Dashboard' }
];

export default appRoutes;


