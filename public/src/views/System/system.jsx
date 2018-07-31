import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';


import {Card} from 'components/Cards/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';

const ReactHighcharts = require('react-highcharts');
const Highcharts = ReactHighcharts.Highcharts;

require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

class System extends Component {
    constructor(props){
        super(props);
        this.state = {
            cpuInfo: []
        };

        this.chartRef = new Map();
        this.getSysInfo = this.getSysInfo.bind(this);
        this.setSysLoad = this.setSysLoad.bind(this);
        this.getSysChartConfig = this.getSysChartConfig.bind(this);
    }
    componentDidMount(){
        this.getSysInfo();
        this.timer = setInterval(()=>{
            this.setSysLoad();
        }, 3000);
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    setSysLoad(){

    }
    getSysChartConfig(){
        return {
            chart: {
                type: 'solidgauge',
                height: 180,
                width: 300
            },                        
            title: null,                        
            pane: {
                center: ['50%', '50%'],
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
                min: 0,
                max: 100,
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
        let api = '/system/curload';
        let self = this;
        fetch(api).then((res)=>{
            res.json().then((data)=>{
                if(data && data.cpus && data.cpus.length>0){
                    data.cpus.forEach((c)=>{
                        c.config = self.getSysChartConfig();
                        c.config.series= [{
                            name: 'Load',
                            data: [Math.round(c.load * 100)/100],
                            dataLabels: {
                                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>'
                            },
                            tooltip: {
                                valueSuffix: ' %'
                            }
                        }];
                    });
                    self.setState({cpuInfo: data.cpus});
                }
            });
        }).catch(err=>console.log(err));
    }
    processSysInfo(){
        
    }
    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row >
                            {this.state.cpuInfo && this.state.cpuInfo.map((c, idx) => 
                                <Col lg={3} sm={6} key={idx} >
                                    <Card title={ 'CPU:' + idx} 
                                            category="System information"  
                                            content={
                                                <ReactHighcharts ref={ (ref)=>{this.chartRef.set(idx, ref);} } config={c.config}></ReactHighcharts>
                                            }
                                            legend={
                                                <div className="legend">
                                                    CPU: {idx}
                                                </div>
                                            }>
                                    </Card>
                                </Col>
                            )}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default System;
