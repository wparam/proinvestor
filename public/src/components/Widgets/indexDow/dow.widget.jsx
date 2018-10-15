import React, { Component } from 'react';
import http from 'modules/ajaxCalls';

export default class IndexDow extends Component{
    constructor(props){
        super(props);
        this.api = '/DIA/realtime-update?last=3&chart=true&changeFromClose=true'
        this.state = {

        };
    }
    componentDidMount(){

    }
    render() {
        return (
            <div>
                <ReactHighcharts config={this.state.mem}></ReactHighcharts>
            </div>
        );
    }
}
