import React from 'react';
import ReactDOM from 'react-dom';

class List extends React.Component{
    render(){
        let items = this.props.items.map(item => {
            return <ListItem name="" title="" />
        });
        return (
            <div>
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
}

class ListItem extends React.Component{
    return (){
        return (
            <li>
                <span>{this.props.name}</span>
                <span>{this.props.title}</span>
            </li>
        );
    }
}

module.exports = List;