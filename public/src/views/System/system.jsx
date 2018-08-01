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
            cpuInfo: [],
            mem: {}
        };
        this.sysapi = '/system/curload';
        this.memapi = '/system/mem';
        this.chartRef = new Map();
        this.getSysInfo = this.getSysInfo.bind(this);
        this.setSysLoad = this.setSysLoad.bind(this);
        this.getMemInfo = this.getMemInfo.bind(this);
        this.getSysChartConfig = this.getSysChartConfig.bind(this);
    }
    componentDidMount(){
        this.getSysInfo();
        this.getMemInfo();
        this.timer = setInterval(()=>{
            this.setSysLoad();
        }, 5000);
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    setSysLoad(){
        let self = this;
        fetch(this.sysapi).then((res)=>{
            res.json().then((data)=>{
                if(data && data.cpus && data.cpus.length>0){
                    data.cpus.forEach((c, i)=>{
                        let chart = self.chartRef.get(i);
                        if(!chart || !chart.chart){
                            console.error('Specific cpu chart ref is empty');
                            return;
                        }
                        let chartSpeed = chart.chart;
                        let load = Math.round(c.load * 100)/100;
                        let point = chartSpeed.series[0].points[0];
                        point.update(load);
                    });
                }
            });
        }).catch(err=>console.log(err));
    }
    getSysChartConfig(){
        return {
            chart: {
                type: 'solidgauge',
                height: 150
            },                        
            title: null,                        
            pane: {
                center: ['50%', '80%'],
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
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -5
                            },
                            title: {
                                text: null
                            }
                        },
                        subtitle: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        }
                    }
                }]
            }
        };
    }
    getSysInfo(){
        let self = this;
        fetch(this.sysapi).then((res)=>{
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
    getMemChartConfig(meminfo){
        let used = Math.round( (meminfo.used/meminfo.total) * 100 )/100;
        let series = [{
            name: 'Usage',
            colorByPoint: true,
            data:[
                {
                    name: 'Used',
                    y: used
                },{
                    name: 'Free',
                    y: 100 - used
                }
            ]
        }];
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 150
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: series,
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -5
                            },
                            title: {
                                text: null
                            }
                        },
                        subtitle: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        }
                    }
                }]
            }
        };
    }
    getMemInfo(){
        fetch(this.memapi).then((res)=>{
            res.json().then((data)=>{
                let chart = this.getMemChartConfig({
                    total: data.total,
                    used: data.used,
                    free: data.free
                });
                this.setState({mem: chart });
            });
        }).catch((err)=>{console.error(err);});
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
                            <Col lg={3} sm={6} >        
                                <Card title="Memory Usage" 
                                        category="System information"  
                                        content={
                                            <ReactHighcharts config={this.state.mem}></ReactHighcharts>
                                        }
                                        legend={
                                            <div className="legend">
                                                Memory
                                            </div>  
                                        }>
                                </Card>
                            </Col>
                            <Col lg={3} sm={6} >        
                                <Card title="Memory Usage" 
                                        category="System information"  
                                        content={
                                            <ReactHighcharts config={this.state.mem}></ReactHighcharts>
                                        }
                                        legend={
                                            <div className="legend">
                                                Memory
                                            </div>  
                                        }>
                                </Card>
                            </Col>
                    </Row>
                    
                </Grid>
            </div>
        );
    }
}

export default System;
