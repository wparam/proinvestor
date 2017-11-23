import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    constructor(props){
        super(props);
        this.foo = this.foo.bind(this);
        this.state = {title: 'this is a state'};
    }
    foo() {
        return (<SubRoot/>);
    }
    render() {
        return (
            <div >
                {this.foo()}
            </div>
        );
    }
}


class SubRoot extends React.Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        console.log(e);
        console.log('event is clicked');
    }
    render() {
        return (
            <div> This is a button
                <button onClick={this.onClick} >ClickMe</button>
            </div>
            
        );
    }
}

ReactDOM.render(
  <Root name='jason'/>,
  document.getElementById('root')
);