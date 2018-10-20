import React, {Component} from 'react';
import moment from "moment";
import { Log } from 'modules/system';
const ReactHighstock = require('react-highcharts/ReactHighstock.src');

const Highcharts = ReactHighstock.Highcharts;

export default class AreaChart extends Component{
    constructor(props){
        super(props);
        this.getAreaOptions = this.getAreaOptions.bind(this);
        this.getSeriesColor = this.getSeriesColor.bind(this);
        this.getSubtitle = this.getSubtitle.bind(this);
        this.quote = this.props.quote;
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }
    getSubtitle(){
        if(!this.props.quote || Object.getOwnPropertyNames(this.props.quote).length === 0){
            return '';
        }
        let { latestPrice, previousClose } = this.props.quote;
        let pct = ( Math.abs((latestPrice - previousClose))*100/previousClose ).toFixed(2);
        return `${(latestPrice - previousClose).toFixed(2)} (${pct})`;
    }
    getSeriesColor(){
        //todo: decide what is latest price
        if(!this.props.quote || Object.getOwnPropertyNames(this.props.quote).length === 0){
            Log.info('Render area chart: the stock quote is empty');
            return Highcharts.getOptions().colors[0];
        }
        let { latestPrice, previousClose } = this.props.quote;
        return latestPrice > previousClose ? '#02f23e' : 'red';
    }
    getAreaOptions(){
        if(!this.props.quote || !this.props.series || this.props.series.length ===0){
            Log.warn('Render area chart: empty quote and data');
            return null;
        }
        let { previousClose, open, close, high, low  } = this.props.quote || {};
        let clr = this.getSeriesColor();
        let subtitle = this.getSubtitle();
        let opts =  Object.assign(
                    {
                        subtitle: {
                            text: subtitle,
                            style: {
                                "color": clr
                            }
                        },
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
                                zIndex: 10,
                                label: {
                                    text: 'Previous Close: '+previousClose
                                }
                            }]
                        },
                        plotOptions: {
                            area:{
                                dataGrouping:{
                                    enabled: false
                                },
                                color: clr,
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
                                        [0, clr],
                                        [1, 'white']
                                    ]
                                },
                                threshold: null
                            }
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
        console.log(opts);
        return (
            <div>
                <ReactHighstock config={opts}></ReactHighstock>
            </div>
        );
    }
}