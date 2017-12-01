import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    constructor(props, context){
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
        this.state = {
            cbox: false
        };
    }
    onClick(e) {
        this.setState(pre => ({
            cbox: !pre.cbox
        }));
    }
    render() {
        return (
            <div> This is a button <br/>
                <button onClick={this.onClick} >ClickMe</button>
                <input type="checkbox" checked={this.state.cbox}/>
            </div>
            
        );
    }
}

ReactDOM.render(
  <Root name='jason'/>,
  document.getElementById('root')
);