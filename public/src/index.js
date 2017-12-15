import React from 'react';
import ReactDOM from 'react-dom';
import {List, ListItem} from './lists.js';

var ds = [
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
            filter: '',
            showInStock: false,
            filterList: ds
        };
        this.dataSet = ds;
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onShowStockChange = this.onShowStockChange.bind(this);
        this.showPromise = this.showPromise.bind(this);
        this.filterPromise = this.filterPromise.bind(this);
        this.filterDataSet = this.filterDataSet.bind(this);
    }
    dataSet(){
        return [
            { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
            { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
            { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
            { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
            { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
            { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' }
        ];
    }
    showPromise(ds){
        if(this.state.showInStock)
            return ds.filter(item => {
                return item.stocked;
            });
        else
            return ds;
    }   
    filterPromise(ds){
        if(!this.state.filter)
            return ds;
        return ds.filter(item => {
                if(item.name.indexOf(this.state.filter)>=0)
                    return true;
                return false;
            });
    }
    filterDataSet(){
        return this.filterPromise(this.showPromise(this.dataSet));
    }
    onFilterChange(e){
        this.setState({
            filter : e.target.value
        });
        this.filterDataSet();
    }
    onShowStockChange(e){
        this.setState(preState => ({
            showInStock : !preState.showInStock
        }));
        this.filterDataSet();
    }
    render() {
        return (
            <div > 
                <SearchBox filter={this.state.filter} onFilterChange={this.onFilterChange} 
                    onShowStockChange={this.onShowStockChange} showInStock={this.state.showInStock}/>
                <List stocks={this.filterDataSet()} />
            </div>
        );
    }
}

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div>
                    <input type="text" value={this.props.filter} onChange={this.props.onFilterChange} 
                        placeholder="Search..." />
                </div>
                <div>
                    <input type="checkbox" id="showLabel" value={this.props.showInStock} onChange={this.props.onShowStockChange}/>
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