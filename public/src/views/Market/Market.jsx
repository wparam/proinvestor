import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import Card from 'components/Cards/Card.jsx';

import IndexDow from 'widgets/indexDow/dow.widget';
import IndexSap from 'widgets/indexSap/sap.widget';
import IndexTqqq from 'widgets/indexNasdaq/nasdaq.widget';


const Market = props => (
    <div className="content">
        <Grid fluid>
            <Row>
                <Col lg={4} sm={8}>
                    <Card title="DJIA" 
                            category=""  
                            content={
                                <IndexDow />
                            }
                            legend={
                                <div className="legend">
                                    Dow Jones Industrial Average
                                </div>  
                            }>
                    </Card>
                </Col>
                <Col lg={4} sm={8}>
                    <Card title="S&P 500" 
                            category=""  
                            content={
                                <IndexSap />
                            }
                            legend={
                                <div className="legend">
                                    S&P 500 Index
                                </div>  
                            }>
                    </Card>
                </Col>
                <Col lg={4} sm={8}>
                    <Card title="NASDAQ" 
                            category=""  
                            content={
                                <IndexTqqq/>
                            }
                            legend={
                                <div className="legend">
                                    NASDAQ Composite
                                </div>  
                            }>
                    </Card>
                </Col>
            </Row>
        </Grid>
    </div>
);

export default Market;