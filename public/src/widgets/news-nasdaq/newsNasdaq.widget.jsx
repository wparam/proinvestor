import React, { Component }  from 'react';
import { Table } from 'react-bootstrap';
import { Log } from 'modules/system';
import { Util } from 'modules/util';
import http from 'modules/ajaxCalls';

import './newsNasdaq.scss';

export default class NewsList extends Component{
    constructor(props){
        super(props);
        this.apiCompanyNews = '/api/stock/stock/market/batch?symbols={symbols}&types=news&range=1d';
        switch(this.props.market){
            case 'dow': 
                this.apiCompanys = '';
                break;
            case 'sap':
                this.apiCompanys = '';
                break;
            case 'nasdaq': 
            default:
                this.apiCompanys = '/api/internal/company/list';
        }
        this.getNews = this.getNews.bind(this);
        this.getConcreteComponent = this.getConcreteComponent.bind(this);
        this.getFullComponent = this.getFullComponent.bind(this);
        this.state = {
            news: []
        };
    }
    componentDidMount(){
        // var requests = [ http.get(this.apiNasCompanys), http.get(this.apiGainers), http.get(this.apiLosers) ];
        http.get(this.apiCompanys).then((companies)=>{
            let str = companies.map(c=>c.symbol).join(',');
            http.get(this.apiCompanyNews.replace('{symbols}', str)).then((d)=>{
                let data = [].concat(...Array.from(Object.values(d)).map(ns=>ns.news));
                this.setState({
                    news: data
                });
            });
        });
    }
    componentDidUpdate(){}
    getNews(top=15){
        if(!this.state.news || this.state.news.length===0){
            Log.warn('Top Movers: no company information');
            return;
        }
        const compare = (a, b)=>{
            let at = new Date(a.datetime),
                bt = new Date(b.datetime);
            if(at.toString === 'Invalid Date' || bt.toString()==='Invalid Date'){
                Log.warn('Parse date error: got invalid date');
                return;
            }
            return at > bt ? -1 : ( at === bt ? 0 : 1); 
        };
        let ns = this.state.news.sort(compare);
        return ns.slice(0, top);
    }
    getConcreteComponent(){ 
        let news = this.getNews();        
        if(!news || news.length === 0){
            return (<div>No news data</div>);
        }
        return (
            <div className="newsContainer">{news.map((ns, idx)=>
                <div key={idx} className="outerContainer">
                    { ns.showImg ? 
                        (<div>
                            <img src={ns.image}  alt="Not available"/>
                        </div>) : (null) 
                    }
                    <div className="txtContainer">
                        <div>From {ns.source} - {ns.datetime.replace(/-[^-]+$/gm, '').replace('T',' ')}</div>
                        <div><a href={ns.url} style={{pointer: 'cursor'}}>{ns.headline}</a></div>
                        <div>{ns.summary}</div>
                    </div>
                </div>
            )}</div>
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

