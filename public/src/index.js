import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    constructor(props){
        super(props);
        this.foo = this.foo.bind(this);
    }
    foo() {
        return 'abc';
    }
    render() {
        return (
            <div >
                This is a JSX root, {foo()}
            </div>
        );
    }
}



ReactDOM.render(
  <Root name='jason'/>,
  document.getElementById('root')
);