import React, { Component } from 'react';
import http from 'modules/ajaxCalls';
import AreaChart from 'components/Charts/area.chart.jsx';

export default class IndexDow extends Component{
    constructor(props){
        super(props);
        this.api = '/DIA/realtime-update?last=3&chart=true';
        this.state = {
            data: []
        };
    }
    componentDidMount(){
        let self = this;
        http.get(this.api).then((d)=>{
            self.setState({
                data: d
            });
        });
    }
    render() {
        const options = {};
        return (
            <div>
                <AreaChart options={null} data={ this.state.data } ></AreaChart>
            </div>
        );
    }
}
