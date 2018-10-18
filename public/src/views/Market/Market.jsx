import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import Card from 'components/Cards/Card.jsx';
import IndexDow from 'components/Widgets/indexDow/dow.widget.jsx';

export const Market = props => (
    <div className="content">BAC
        <Grid fluid>
            <Row>
                <Col lg={4} sm={8}>
                    <Card title="DJIA" 
                            category="IDX"  
                            content={
                                <IndexDow/>
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
                            category="IDX"  
                            content={
                                <div/> //placeholder
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
                            category="IDX"  
                            content={
                                <div/> //placeholder
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
)

/*


export default class Market extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={4} sm={8}>
                            <Card title="DJIA" 
                                    category="IDX"  
                                    content={
                                        <ReactHighcharts config={this.state.mem}></ReactHighcharts>
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
                                    category="IDX"  
                                    content={
                                        <ReactHighcharts config={this.state.mem}></ReactHighcharts>
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
                                    category="IDX"  
                                    content={
                                        <ReactHighcharts config={this.state.mem}></ReactHighcharts>
                                    }
                                    legend={
                                        <div className="legend">
                                            NASDAQ Composite
                                        </div>  
                                    }>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                    </Row>
                    <Row>
                        
                    </Row>

                </Grid>
            </div>
        );

    }
}

*/