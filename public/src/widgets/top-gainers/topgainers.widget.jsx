import React, { Component }  from 'react';
import { Table } from 'react-bootstrap';
import { Log } from 'modules/system';

export default class TopGainers{
    //props:
    //enableSearch: false, showConcrete: false
    constructor(props){
        super(props);
        this.api = '/api/stock/stock/market/collection/list?collectionName=gainers';
        this.getConcreteComponent = this.getConcreteComponent.bind(this);
        this.getFullComponent = this.getFullComponent.bind(this);
        this.state = {
            data : []
        };
    }
    componentDidMount(){
        http.get(this.api).then((d)=>{
            this.setState({
                data: d
            });
        });
    }
    componentDidUpdate(){}
    getTopGainers(top){
        let top = top || 5;
        if(!this.state.data || this.state.data.length===0){
            Log.warn('Top Gainers: no gainer input');
            return;
        }
        let gainers = this.state.data.slice();
        let compare = (a, b)=>{
            return a.changePercent > b.changePercent ? 1 : ( a.changePercent === b.changePercent ? 0 : -1 );
        };
        gainers.sort(compare);
        console.log(gainers);
        return gainers.slice(0, top);
    }
    getConcreteComponent(){
        let d = this.getTopGainers();
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Change %</th>
                        <th>Price</th>
                        <th>Vol</th>
                        <th>Avg Vol</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                </tbody>
            </Table>
        );
    }
    getFullComponent(){
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Change %</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                </tbody>
            </Table>
        );
    }
    render(){
        return (
            <div>
                { this.props.showConcrete ? ( this.getConcreteComponent() ): ( this.getFullComponent() )} 
            </div>  
        );
    }
}