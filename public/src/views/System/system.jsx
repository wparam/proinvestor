import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';


import {Card} from 'components/Cards/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';

const ReactHighcharts = require('react-highcharts');
const Highcharts = ReactHighcharts.Highcharts;

class System extends Component {
    constructor(props){
        super(props);
        this.state = {
            cpuInfo:null
        };
        this.getSysInfo = this.getSysInfo.bind(this);
        this.getSysChartConfig = this.getSysChartConfig.bind(this);
    }
    componentDidMount(){
        this.getSysInfo();
    }
    getSysChartConfig(){
        return {
            chart: {
                type: 'solidgauge'
            },                        
            title: null,                        
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },                        
            tooltip: {
                enabled: false
            },                        
            yAxis: {
                stops: [
                    [0.1, '#55BF3B'], // green
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#DF5353'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },
            series: [{
                name: 'Speed',
                data: [80],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:12px;color:silver">km/h</span></div>'
                },
                tooltip: {
                    valueSuffix: ' km/h'
                }
            }],
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };
    }
    getSysInfo(){
        let resultComp = null;
        let api = '/system/curload';
        fetch(api).then((res)=>{
            res.json().then((data)=>{
                if(data && data.cpus && data.cpus>0){
                    resultComp = data.cpus.map((c, idx)=>{
                        let config = 
                        <Card title="CPU:{idx}"
                                category="System information"  
                                content={
                                    <ReactHighcharts config={config}></ReactHighcharts>
                                }
                                legend={
                                    <div className="legend">
                                        Legend: {idx}
                                    </div>
                                }>
                        </Card>
                    });
                }
            });
        }).catch(err=>console.log(err));

        return resultComp;
    }
    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            {this.state.cpuInfo.map((c))}
                        </Col>
                        <Col lg={3} sm={6}>
                            
                        </Col>
                        <Col lg={3} sm={6}>
                            
                        </Col>
                        <Col lg={3} sm={6}>
                            
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default System;
