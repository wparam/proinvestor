import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


const products = [ {id: 'a', 'Product ID': 'ab'} ];
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

class TableList extends Component {

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                           <BootstrapTable keyField='id' data={ products } columns={ columns } />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default TableList;
