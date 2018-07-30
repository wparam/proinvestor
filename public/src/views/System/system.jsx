import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';


import {Card} from 'components/Cards/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';

const ReactHighcharts = require('react-highcharts');

class System extends Component {
    getSysInfo(){
        return ( 
            <Card>
                
            </Card>
        );
    }
    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <Card
                                title=""
                                statsText="Capacity"
                                statsValue="105GB"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
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
