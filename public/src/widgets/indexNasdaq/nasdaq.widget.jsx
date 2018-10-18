import React, { Component } from 'react';
import http from 'modules/ajaxCalls';
import AreaChart from 'components/Charts/area.chart';
import { BaseChart } from 'components/Charts/base.chart';

const ReactHighChart = require('react-highcharts');
const Highcharts = ReactHighChart.Highcharts;

export default class IndexTqqq extends Component{
    constructor(props){
        super(props);
        this.api = '/api/stock/stock/DIA/realtime-update?last=3&chart=true';
        this.state = {
            data: []
        };
        this.getSeries = this.getSeries.bind(this);
    }
    componentDidMount(){
        let self = this;
        
        //mock
        let mockdata = [
            {
                "date": "20181017",
                "minute": "10:14",
                "average": 60.736,
                "marketAverage": 255.702
            },
            {
                "date": "20181017",
                "minute": "10:15",
                "average": 62.736,
                "marketAverage": 255.702
            },
            {
                "date": "20181017",
                "minute": "10:16",
                "average": 65.736,
                "marketAverage": 255.702
            },
            {
                "date": "20181017",
                "minute": "10:17",
                "average": 68.736,
                "marketAverage": 255.702
            }
        ];
        this.setState({
            data: BaseChart.getIntradayLine(mockdata)
        });
        // http.get(this.api).then((d)=>{
        //     self.setState({
        //         data: d
        //     });
        // });
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
            name: 'TQQQ',
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
