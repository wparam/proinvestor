import React, {Component} from 'react';
import moment from "moment";

const ReactHighstock = require('react-highcharts/ReactHighstock.src');


// const options = 
export default class AreaChart extends Component{
    constructor(props){
        super(props);
        this.getAreaOptions = this.getAreaOptions.bind(this);
        this.quote = this.props.quote;
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }
    getAreaOptions(){
        let { previousClose, open, close, high, low  } = this.props.quote || {};
        console.log(previousClose);
        console.log(this.props.quote);
        let opts =  Object.assign(
                    {
                        xAxis: {
                            gapGridLineWidth: 0
                        },
                        time: {
                            useUTC: false
                        },
                        yAxis: {
                            plotLines: [{
                                value: previousClose,
                                color: 'grey',
                                dashStyle: 'shortdash',
                                width: 2,
                                label: {
                                    text: 'Previous Close: '+previousClose

                                }
                            }]
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
                            }, {
                                type: 'month',
                                count: 3,
                                text: '3m'
                            }, {
                                type: 'month',
                                count: 6,
                                text: '6m'
                            }, {
                                type: 'ytd',
                                text: 'YTD'
                            }, {
                                type: 'year',
                                count: 1,
                                text: '1y'
                            }, {
                                type: 'all',
                                text: 'All'
                            }],
                            selected: 1,
                            inputEnabled: false
                        },
                        series: this.props.series
                    }, this.props.options);
        return opts;
    }
    render() {
        const opts = this.getAreaOptions();
        return (
            <div>
                <ReactHighstock config={opts}></ReactHighstock>
            </div>
        );
    }
}