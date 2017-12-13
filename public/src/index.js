import React from 'react';
import ReactDOM from 'react-dom';
import {List, ListItem} from './lists.js';


const sd = [
    { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
    { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
    { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
    { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
    { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
    { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' }
];

class Compon extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            filter: ''
        };
    }
    render() {
        return (
            <div >
                <SearchBox />
                <List stocks={sd} />
            </div>
        );
    }
}

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            showInStock: false
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onTextClick = this.onTextClick.bind(this);
        this.onCbChange = this.onCbChange.bind(this);
    }
    onTextChange(e) {
        this.setState({
            search : e.target.value
        });
    }
    onCbChange(e){
        this.setState({
            showInStock : e.target.value
        });
    }
    onTextClick(){
        this.setState({
            search: ''
        });
    }
    render() {
        return (
            <div>
                <div>
                    <input type="text" value={this.state.search} onChange={this.onTextChange} 
                        placeholder="Search..." onClick={this.onTextClick}/>
                </div>
                <div>
                    <input type="checkbox" id="showLabel" onChange={this.onCbChange}/>
                    <label htmlFor="showLabel">Only show products in stock</label>
                </div>
            </div>
        );
    }
}

// class 

ReactDOM.render(
    <Compon />,
    document.getElementById('root')
);