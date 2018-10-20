import React, { Component } from 'react';
import http from 'modules/ajaxCalls';
import AreaChart from 'components/Charts/area.chart';
import { BaseChart } from 'components/Charts/base.chart';

const ReactHighChart = require('react-highcharts');
const Highcharts = ReactHighChart.Highcharts;

export default class IndexTqqq extends Component{
    constructor(props){
        super(props);
        this.api = '/api/stock/stock/TQQQ/realtime-update?last=3&chart=true';
        this.state = {
            data: [],
            quote: {}
        };
        this.getSeries = this.getSeries.bind(this);
        this.getOption = this.getOption.bind(this);
    }
    componentDidMount(){
        let self = this;
        http.get(this.api).then((d)=>{
            self.setState({
                data: BaseChart.getIntradayLine(d.chart),
                quote: d.quote
            });
        });
    }
    getOption(){
        return {
            chart:{
                height: 300
            },
            title: {
                text:  'TQQQ'
            },
            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'hour',
                    count: 3,
                    text: '3h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1D'
                }],
                selected: 1,
                allButtonsEnabled: true,
                inputEnabled: false 
            },
            navigator:{
                enabled: false
            }
        };
    }
    getSeries(){
        return [{
            name: 'TQQQ',
            type: 'area',
            data: this.state.data
        }];
    }
    render() {
        const series = this.getSeries();
        const opts = this.getOption();
        return (
            <div>
                <AreaChart options={opts} series={ series } quote={ this.state.quote }></AreaChart>
            </div>
        );
    }
}
