import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    constructor(){
        
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