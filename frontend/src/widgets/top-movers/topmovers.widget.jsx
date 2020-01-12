import React, { Component }  from 'react';
import { Table } from 'react-bootstrap';
import { Log } from 'modules/system';
import { Util } from 'modules/util';
import http from 'modules/ajaxCalls';

export default class TopMoversInNas extends Component{
    constructor(props){
        super(props);
        this.apiNasCompanys = '/api/internal/company/list';
        this.apiNasStocks = '/api/stock/stock/market/batch?symbols={symbols}&types=quote&range=1d';
        this.getTopMovers = this.getTopMovers.bind(this);
        this.getConcreteComponent = this.getConcreteComponent.bind(this);
        this.getFullComponent = this.getFullComponent.bind(this);
        this.state = {
            companies: []
        };
    }
    componentDidMount(){
        // var requests = [ http.get(this.apiNasCompanys), http.get(this.apiGainers), http.get(this.apiLosers) ];
        http.get(this.apiNasCompanys).then((companies)=>{
            if(!companies || companies.length === 0){
                console.error('No company infor');
                return;
            }
            let str = companies.map(c=>c.symbol).join(',');
            http.get(this.apiNasStocks.replace('{symbols}', str)).then((d)=>{
                this.setState({
                    companies:d
                });
            });
        });
    }
    componentDidUpdate(){}
    getTopMovers(top=5){
        if(!this.state.companies || this.state.companies.length===0){
            Log.warn('Top Movers: no company information');
            return;
        }
        let companyArray = Array.from(Object.values(this.state.companies));
        let compare = (a, b)=>{
            let ac = Math.abs(a.quote.changePercent),
                bc = Math.abs(b.quote.changePercent);
            return ac > bc ? -1 : ( ac === bc ? 0 : 1 );
        };
        companyArray.sort(compare);
        return companyArray.slice(0, top).map(n=>n.quote);
    }
    getConcreteComponent(){ 
        let movers = this.getTopMovers();        
        if(!movers || movers.length === 0){
            return (<div>No movers Data</div>);
        }
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <td>Company</td>
                        <td>Change%</td>
                        <td>Price</td>
                        <td>Vol</td>
                        <td>Avg Vol</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        movers.map((row, idx) => 
                            <tr key={idx}>
                                <td>
                                    <a><span>{row['symbol']}</span>
                                       <div style={desc} title={row['companyName']}>{row['companyName'] && row['companyName'].length >= 32 ? row['companyName'].substr(0, 30) + '...' : row['companyName'] }</div>
                                    </a>
                                </td>
                                <td style={ row['changePercent']>0 ? upTrend : downTrend }>
                                    {Util.numberFormat(row['changePercent'], 'percentage')}
                                </td>
                                <td>
                                    {Util.numberFormat(row['latestPrice'], 'thousand')}
                                </td>
                                <td>
                                    {Util.numberFormat(row['latestVolume'], 'thousand')}
                                </td>
                                <td>
                                    {Util.numberFormat(row['avgTotalVolume'], 'thousand')}
                                </td>
                            </tr>
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

const upTrend = {
    color: '#0f9d58'
};

const downTrend = {
    color: 'red'
};