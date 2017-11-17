import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    constructor(props){
        super(props);
        // this.foo = this.foo.bind(this);
    }
    foo() {
        return (<div>Foo is here</div>);
    }
    render() {
        return (
            <div >
                This is a JSX root, {this.foo()}
            </div>
        );
    }
}



ReactDOM.render(
  <Root name='jason'/>,
  document.getElementById('root')
);