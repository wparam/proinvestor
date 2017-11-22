import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    constructor(props){
        super(props);
        this.foo = this.foo.bind(this);
        this.state = {title: 'this is a state'};
    }
    foo() {
        return (<div>{this.props.name} is here</div>);
    }
    render() {
        return (
            <div >
                <SubRoot name='jason sub'/>
                This is a JSX root, {this.foo()} 
                This is a state: {this.state.title}
            </div>
        );
    }
}


class SubRoot extends React.Component {
    constructor(props){
        super(props);

    }
    render() {
        return (
            <div> This is a subone: {this.props.name} 
                <div> This is a state: {this.state.title} </div>
            </div>
            
        );
    }
}

ReactDOM.render(
  <Root name='jason'/>,
  document.getElementById('root')
);