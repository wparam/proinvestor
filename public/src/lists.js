import React from 'react';
import ReactDOM from 'react-dom';

class List extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let items = this.props.stocks.map((item, index) => {
            return <ListItem name={item.name} price={item.price} key={index} stocked={item.stocked}/>;
        });
        return (
            <div>
                <ul>
                    <li>
                        <span style={ {  color: 'blue' } }>Name</span>
                        <span style={ { color: 'blue', marginLeft: '25px' } }>Price</span>
                    </li>
                    {items}
                </ul>
            </div>
        );
    }
}

class ListItem extends React.Component{
    render (){
        let span2Style = {
            marginLeft: '25px'            
        };
        let spanColor = {
            color: this.props.stocked ? '' : 'red'
        };
        return (
            <li>
                <span style={ spanColor }>{this.props.name}</span>
                <span style={ span2Style }>{this.props.price}</span>
            </li>
        );
    }
}

module.exports = { List, ListItem };