import React, { Component }  from 'react';
import { Table } from 'react-bootstrap';
import { Log } from 'modules/system';
import { Util } from 'modules/util';
import http from 'modules/ajaxCalls';

export default class TopGainers extends Component{
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
    getTopGainers(top=5){
        if(!this.state.data || this.state.data.length===0){
            Log.warn('Top Gainers: no gainer input');
            return;
        }
        let gainers = this.state.data.slice();
        let compare = (a, b)=>{
            return a.changePercent > b.changePercent ? -1 : ( a.changePercent === b.changePercent ? 0 : 1 );
        };
        gainers.sort(compare);
        return gainers.slice(0, top);
    }
    getConcreteComponent(){ 
        let d = this.getTopGainers();
        let models = [  { title: 'Company', name: 'symbol', des: 'companyName', order: 0, format: '' },
                        { title: 'Change%', name: 'changePercent', des: '', order: 1, format: 'percentage' },
                        { title: 'Price', name: 'latestPrice', des: '', order: 2, format: 'thousand' },
                        { title: 'Vol', name: 'latestVolume', des: '', order: 3, format: 'thousand' },
                        { title: 'Avg Vol', name: 'avgTotalVolume', des: '', order: 4, format: 'thousand' }
                     ];
        let gainers = this.getTopGainers();
        if(!gainers || gainers.length === 0){
            return (<div>No Gainer Data</div>);
        }
        return (
            <Table responsive>
                <thead>
                    <tr>
                        {
                            models.map((n)=><th key={n.order}>{n.title}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        gainers.map((row, idx) => 
                            <tr key={idx}>{
                                models.map((n) => 
                                        <td key={n.order}>
                                            <a><span>{ !n.format ? row[n.name]: Util.numberFormat(row[n.name], n.format) }</span> 
                                                { row[n.des] ? <div style={desc} title={row[n.des]}>{(row[n.des] && row[n.des].length >= 32) ? 
                                                    row[n.des].substr(0, 30) + '...' : row[n.des]
                                                }</div> : null }
                                            </a> 
                                        </td>
                                )}</tr>
                        )
                    }
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
const desc = {
    fontSize: '11px',
    whiteSpace: 'nowrap'
};

const upGreen = {
    color: '#0f9d58'
};