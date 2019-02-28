import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faIgloo } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './table.scss';
class TableList extends Component {
    getDate(){
        return [
            {name: 'Jason', age: 20, title: 'Manager', region: 'Beijing'},
            {name: 'Kate', age: 30, title: 'Cip', region: 'Shanghai'},
            {name: 'Jimmy', age: 22, title: 'Afew', region: 'Dongjing'},
            {name: 'Tup', age: 40, title: 'Aqqe', region: 'Dongggou'}
        ];
    }
    render() {
        const data = this.getDate();
        return (
            <div className="content container">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                           <Table striped bordered hover condensed>
                               <thead>
                                    <tr>
                                        <th >Name<i class="fa fa-sort"></i></th>
                                        <th >Age<i class="fa fa-sort"></i></th>
                                        <th >Title<i class="fa fa-sort"></i></th>
                                        <th >Region<i class="fa fa-sort"></i></th>
                                    </tr>
                               </thead>
                               <tbody>
                                   {
                                    data.map((emp, k)=><tr key={k}>
                                        <td>{emp.name}</td>
                                        <td>{emp.age}</td>
                                        <td>{emp.title}</td>
                                        <td>{emp.region}</td>
                                    </tr>)
                                   }
                               </tbody>
                           </Table>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default TableList;
