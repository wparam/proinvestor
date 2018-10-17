import React, {Component} from 'react';


// const options = 
export default class AreaChart extends Component{
    constructor(props){
        super(props);
        this.state = {
            options: {}
        };
        console.log(props);
    }
    render() {
        return (
            <div>
                <ReactHighcharts config={this.state.options}></ReactHighcharts>
            </div>
        )
    }
}