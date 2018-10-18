import React, { Component } from 'react';
import http from 'modules/ajaxCalls';
import AreaChart from 'components/Charts/area.chart';
import { BaseChart } from 'components/Charts/base.chart';

const ReactHighChart = require('react-highcharts');
const Highcharts = ReactHighChart.Highcharts;

export default class IndexSap extends Component{
    constructor(props){
        super(props);
        this.api = '/api/stock/stock/SPY/realtime-update?last=3&chart=true';
        this.state = {
            data: []
        };
        this.getSeries = this.getSeries.bind(this);
    }
    componentDidMount(){
        var self = this;
        http.get(this.api).then((d)=>{
            self.setState({
                data: BaseChart.getIntradayLine(d.chart)
            });
        });
    }
    getOption(){
        return {
            chart:{
                height: 300
            },
            title: {
                text:  'S&P 500 Index'
            },
            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1D'
                }]
            },
            navigator:{
                enabled: false
            }
        };
    }
    getSeries(){
        return [{
            name: 'S&P500',
            type: 'area',
            data: this.state.data,
            gapSize: 5,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            threshold: null
        }];
    }
    render() {
        const series = this.getSeries();
        const opts = this.getOption();
        return (
            <div>
                <AreaChart options={opts} series={ series } ></AreaChart>
            </div>
        );
    }
}
